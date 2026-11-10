using System.Reflection;
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using CateringStatisticsExam;

internal static class BackendChecks
{
    internal static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web)
    { NumberHandling=System.Text.Json.Serialization.JsonNumberHandling.AllowNamedFloatingPointLiterals };
    internal sealed record Result(bool Passed, string Expected, string Actual, string Details="", bool Changed=false);
    private static readonly TimeSpan Timeout = TimeSpan.FromSeconds(5);

    internal static FoodOrder[] Clone(FoodOrder[] data) => JsonSerializer.Deserialize<FoodOrder[]>(JsonSerializer.Serialize(data,Json),Json)!;
    internal static AppDbContext Database(FoodOrder[] data)
    {
        var db=new AppDbContext(new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("catering-check-"+Guid.NewGuid().ToString("N")).Options);
        db.Orders.AddRange(Clone(data));
        db.SaveChanges();
        db.ChangeTracker.Clear();
        return db;
    }

    internal static async Task<Result> ServiceAsync(TaskSpec spec, QueryCase test)
    {
        using var db=Database(test.Data);
        string before=Format(db.Orders.AsNoTracking().OrderBy(x=>x.Id).ToList());
        object? actual=null;
        string? error=null;
        try
        {
            var method=typeof(FoodOrderQueryService).GetMethod(spec.Method, test.Args.Select(x=>x.GetType()).ToArray());
            if(method?.ReturnType!=typeof(Task<>).MakeGenericType(spec.ResultType))
                throw new MissingMethodException("Az előírt Task<T> metódus vagy paraméterezése hiányzik.");
            actual=await InvokeAsync(new FoodOrderQueryService(db),method,test.Args);
        }
        catch(Exception ex) { error=Error(ex); }
        bool changed=db.ChangeTracker.HasChanges() ||
            before!=Format(db.Orders.AsNoTracking().OrderBy(x=>x.Id).ToList());
        string details=changed?"A lekérdezés módosította az adatokat.":error??"";
        return new(error is null && !changed && Same(test.Expected,actual), Format(test.Expected),
            error??Format(actual), details, changed);
    }

    internal static Result Route(TaskSpec spec)
    {
        var controller=Controller();
        var action=Action(spec);
        bool ok=controller?.GetCustomAttribute<ApiControllerAttribute>() is not null
            && controller.GetCustomAttributes<RouteAttribute>().Any(a=>Normalize(a.Template)=="api/orders")
            && action?.GetCustomAttributes<HttpGetAttribute>().Any(a=>Normalize(a.Template)==spec.Path)==true;
        return new(ok,$"[ApiController], [Route(api/orders)], [HttpGet({spec.Path})]",
            ok?"Az attribútumok és az útvonal helyesek.":"Hiányzó vagy eltérő controller-/GET-attribútum, útvonal vagy action-aláírás.");
    }

    internal static async Task<Result> DelegationAsync(TaskSpec spec)
    {
        using var db=Database([]);
        object sentinel=Sentinel(spec);
        var spy=new SpyService(db,sentinel);
        using var services=new ServiceCollection().AddSingleton<FoodOrderQueryService>(spy).BuildServiceProvider();
        object[] args=spec.Number switch {7=>["Sentinel zone",7],10=>["Sentinel zone"],_=>[]};
        string expected=$"Pontosan egyszer {spec.Method}({string.Join(", ",args)}), majd Ok(service-eredmény).";
        try
        {
            var type=Controller()??throw new MissingMemberException("OrdersController nem található.");
            var action=Action(spec)??throw new MissingMethodException(spec.Action);
            object controller=ActivatorUtilities.CreateInstance(services,type);
            object? result=await InvokeAsync(controller,action,args);
            var ok=UnwrapOk(result);
            bool success=spy.Calls==1 && spy.Method==spec.Method && spy.Args.SequenceEqual(args)
                && ok is not null && Same(sentinel,ok.Value);
            return new(success,expected,$"Hívásszám: {spy.Calls}; metódus: {spy.Method??"(nincs)"}; paraméterek: {Format(spy.Args)}; válasz: {Format(ok?.Value)}.");
        }
        catch(Exception ex) { return new(false,expected,Error(ex)); }
    }

    internal static async Task<Result> HttpAsync(TaskSpec spec, IReadOnlyList<QueryCase> cases)
    {
        var lines=new List<string>();
        bool passed=true;
        foreach(var test in cases)
        {
            try
            {
                using var server=Server(test.Data);
                using var client=server.CreateClient();
                client.Timeout=Timeout;
                string path=Path(spec,test.Args);
                using var response=await client.GetAsync(path);
                string body=await response.Content.ReadAsStringAsync();
                object? value=null;
                if(response.IsSuccessStatusCode)
                    value=JsonSerializer.Deserialize(body,spec.ResultType,Json);
                bool ok=(int)response.StatusCode==200 && Same(test.Expected,value);
                passed &= ok;
                lines.Add($"{test.Id}: GET {path}; elvárt HTTP 200 és {Format(test.Expected)}; kapott HTTP {(int)response.StatusCode}, {body}.");
            }
            catch(Exception ex) { passed=false; lines.Add($"{test.Id}: {Error(ex)}"); }
        }
        return new(passed,"Minden felsorolt kérés: HTTP 200 és a specifikáció szerinti JSON.",
            string.Join(Environment.NewLine,lines),"Valódi ASP.NET Core routing, paraméterkötés, DI, service és EF Core együtt.");
    }

    internal static async Task<Result> ValidationAsync(TaskSpec spec)
    {
        string[] paths=spec.Number==7
            ? ["/api/orders/by-zone/count?zone=Center&minPortions=0",
               "/api/orders/by-zone/count?zone=Center&minPortions=-1",
               "/api/orders/by-zone/count?zone=%20%20&minPortions=1",
               "/api/orders/by-zone/count?minPortions=1",
               "/api/orders/by-zone/count?zone=Center",
               "/api/orders/by-zone/count?zone=Center&minPortions=abc"]
            : ["/api/orders/report?zone=%20%20","/api/orders/report"];
        var lines=new List<string>();
        bool passed=true;
        // A spy verifies that invalid requests never reach the service.
        using var db=Database([]);
        var spy=new SpyService(db,Sentinel(spec));
        try
        {
            using var server=Server([],spy);
            using var client=server.CreateClient();
            client.Timeout=Timeout;
            foreach(string path in paths)
            {
                using var response=await client.GetAsync(path);
                bool ok=(int)response.StatusCode==400;
                passed &= ok;
                lines.Add($"GET {path}: elvárt 400, kapott {(int)response.StatusCode}.");
            }
            passed &= spy.Calls==0;
            lines.Add($"Hibás kérésnél service-hívások: {spy.Calls}; elvárt 0.");
        }
        catch(Exception ex) { passed=false; lines.Add(Error(ex)); }
        return new(passed,"HTTP 400 minden hibás paraméterre; a service nem fut le.",string.Join(Environment.NewLine,lines));
    }

    private static TestServer Server(FoodOrder[] data, FoodOrderQueryService? service=null)
    {
        string name="catering-http-"+Guid.NewGuid().ToString("N");
        var server=new TestServer(new WebHostBuilder()
            .ConfigureLogging(logging=>logging.ClearProviders())
            .ConfigureServices(services=>
            {
                services.AddDbContext<AppDbContext>(options=>options.UseInMemoryDatabase(name));
                if(service is null) services.AddScoped<FoodOrderQueryService>();
                else services.AddSingleton(service);
                services.AddControllers().AddApplicationPart(typeof(FoodOrderQueryService).Assembly);
            })
            .Configure(app=>
            {
                app.UseRouting();
                app.UseEndpoints(endpoints=>endpoints.MapControllers());
            }));
        using var scope=server.Services.CreateScope();
        var db=scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Orders.AddRange(Clone(data));
        db.SaveChanges();
        return server;
    }

    private static string Path(TaskSpec spec, object[] args)
    {
        string path="/api/orders/"+spec.Path;
        if(spec.Number==7) path += "?zone="+Uri.EscapeDataString((string)args[0])+"&minPortions="+args[1];
        if(spec.Number==10) path += "?zone="+Uri.EscapeDataString((string)args[0]);
        return path;
    }

    private static Type? Controller()=>typeof(FoodOrderQueryService).Assembly.GetType("CateringStatisticsExam.Controllers.OrdersController");
    private static MethodInfo? Action(TaskSpec spec)=>Controller()?.GetMethod(spec.Action,BindingFlags.Instance|BindingFlags.Public,
        binder:null,types:spec.Number switch {7=>[typeof(string),typeof(int)],10=>[typeof(string)],_=>Type.EmptyTypes},modifiers:null);
    private static string Normalize(string? route)=>(route??"").Trim('/');

    private static async Task<object?> InvokeAsync(object target,MethodInfo method,object[] args)
    {
        object? invocation=method.Invoke(target,args);
        if(invocation is not Task task) throw new InvalidOperationException("Az action/service nem Task eredményű.");
        await task.WaitAsync(Timeout);
        return task.GetType().GetProperty("Result")?.GetValue(task);
    }

    private static OkObjectResult? UnwrapOk(object? result)
        => result as OkObjectResult ?? result?.GetType().GetProperty("Result")?.GetValue(result) as OkObjectResult;

    internal static bool Same(object expected,object? actual)
    {
        if(actual is null) return false;
        if(expected is double number)
            return actual is double d && double.IsFinite(d) && Math.Abs(number-d)<=.000001;
        if(expected is ZoneReportDto e)
            return actual is ZoneReportDto a && e.TotalCount==a.TotalCount && e.DeliveredCount==a.DeliveredCount
                && e.PaidDeliveredCount==a.PaidDeliveredCount && e.RealizedRevenue==a.RealizedRevenue
                && Same(e.AveragePrepMinutes,a.AveragePrepMinutes) && Same(e.LatePreparationPercentage,a.LatePreparationPercentage);
        if(expected is List<FoodOrder> list)
            return actual is IEnumerable<FoodOrder> orders &&
                Format(list.OrderBy(x=>x.Id))==Format(orders.OrderBy(x=>x.Id));
        return Equals(expected,actual);
    }

    internal static string Format(object? value)=>JsonSerializer.Serialize(value,Json);
    private static string Error(Exception ex)
    {
        if(ex is TargetInvocationException invocation && invocation.InnerException is not null) ex=invocation.InnerException;
        return ex.GetType().Name+": "+ex.Message;
    }
    private static object Sentinel(TaskSpec spec)=>spec.Number switch
    {
        1=>new List<FoodOrder>{ExamCases.O(987,OrderStatus.Preparing,portions:7,actual:0,price:123.45m)},
        2 or 3 or 7=>137,
        4 or 5 or 9=>1234.56m,
        6 or 8=>37.125d,
        10=>new ZoneReportDto{TotalCount=19,DeliveredCount=11,PaidDeliveredCount=7,
            RealizedRevenue=1234.56m,AveragePrepMinutes=3.125,LatePreparationPercentage=100d/3},
        _=>throw new InvalidOperationException()
    };

    private sealed class SpyService(AppDbContext db,object response) : FoodOrderQueryService(db)
    {
        public int Calls {get;private set;}
        public string? Method {get;private set;}
        public object[] Args {get;private set;}=[];
        private Task<T> Record<T>(string method,params object[] args)
        { Calls++; Method=method; Args=args; return Task.FromResult((T)response); }
        public override Task<List<FoodOrder>> GetPreparingOrdersAsync()=>Record<List<FoodOrder>>(nameof(GetPreparingOrdersAsync));
        public override Task<int> CountDeliveredOrdersAsync()=>Record<int>(nameof(CountDeliveredOrdersAsync));
        public override Task<int> SumDeliveredPortionsAsync()=>Record<int>(nameof(SumDeliveredPortionsAsync));
        public override Task<decimal> GetMaximumUnitPriceAsync()=>Record<decimal>(nameof(GetMaximumUnitPriceAsync));
        public override Task<decimal> GetPaidRevenueAsync()=>Record<decimal>(nameof(GetPaidRevenueAsync));
        public override Task<double> GetAverageDeliveredPrepMinutesAsync()=>Record<double>(nameof(GetAverageDeliveredPrepMinutesAsync));
        public override Task<int> CountOrdersByZoneAsync(string zone,int minPortions)=>Record<int>(nameof(CountOrdersByZoneAsync),zone,minPortions);
        public override Task<double> GetLatePreparationPercentageAsync()=>Record<double>(nameof(GetLatePreparationPercentageAsync));
        public override Task<decimal> GetTotalProfitAsync()=>Record<decimal>(nameof(GetTotalProfitAsync));
        public override Task<ZoneReportDto> GetZoneReportAsync(string zone)=>Record<ZoneReportDto>(nameof(GetZoneReportAsync),zone);
    }
}




