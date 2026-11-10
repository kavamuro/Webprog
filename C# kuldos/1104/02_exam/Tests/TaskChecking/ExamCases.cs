using CateringStatisticsExam;

internal sealed record QueryCase(string Id,string Title,decimal Points,FoodOrder[] Data,object Expected,object[] Args);
internal sealed record TaskSpec(int Number,string Level,string Id,string Title,string Method,string Action,
    string Path,Type ResultType,decimal ServiceMax,decimal ApiMax,QueryCase[] Cases);

internal static class ExamCases
{
    internal static FoodOrder O(int id,OrderStatus status=OrderStatus.Delivered,int portions=1,
        int planned=30,int actual=30,decimal price=0,decimal fee=0,decimal discount=0,decimal cost=0,
        bool paid=false,string zone="Center")
        => new(){Id=id,CustomerName=$"Vásárló {id}",DeliveryZone=zone,Status=status,Portions=portions,
            PlannedPrepMinutes=planned,ActualPrepMinutes=actual,UnitPrice=price,DeliveryFee=fee,
            DiscountAmount=discount,CostPerPortion=cost,IsPaid=paid};

    private static QueryCase C(string id,string title,decimal points,object expected,FoodOrder[] data,params object[] args)
        => new(id,title,points,data,expected,args);
    private static QueryCase Empty(object expected,decimal points=1,params object[] args)
        => C("empty","Üres adatbázis esetén is helyes, kivétel nélkül.",points,expected,[],args);

    internal static IReadOnlyList<TaskSpec> All =>
    [
        new(1,"Beginner","preparing","Előkészítés alatt álló rendelések","GetPreparingOrdersAsync","GetPreparingOrders","preparing",typeof(List<FoodOrder>),4,2,
        [
            C("mixed","Csak a Preparing rendelések teljes adatait adja vissza, fizetettségtől függetlenül.",2,
                new List<FoodOrder>{O(1,OrderStatus.Preparing,portions:2,actual:0,price:100,paid:true),O(3,OrderStatus.Preparing,portions:4,actual:0,price:200)},
                [O(1,OrderStatus.Preparing,portions:2,actual:0,price:100,paid:true),O(2),O(3,OrderStatus.Preparing,portions:4,actual:0,price:200),
                 O(4,OrderStatus.Received,actual:0),O(5,OrderStatus.Cancelled,actual:0)]),
            C("no-match","Más állapotokból nem választ; találat nélkül üres lista.",1,new List<FoodOrder>(),[O(1),O(2,OrderStatus.Received,actual:0)]),
            Empty(new List<FoodOrder>())
        ]),
        new(2,"Beginner","delivered-count","Kézbesített rendelések száma","CountDeliveredOrdersAsync","CountDeliveredOrders","delivered/count",typeof(int),4,2,
        [
            C("mixed","A Delivered rekordokat számolja, nem a fizetetteket vagy az adagokat.",2,2,
                [O(1,portions:7,paid:true),O(2,portions:3),O(3,OrderStatus.Preparing,actual:0),O(4,OrderStatus.Cancelled,actual:0),O(5,OrderStatus.Received,actual:0)]),
            C("no-match","Kézbesített rendelés nélkül 0.",1,0,[O(1,OrderStatus.Preparing,actual:0)]),Empty(0)
        ]),
        new(3,"Beginner","delivered-portions","Kézbesített adagok összege","SumDeliveredPortionsAsync","SumDeliveredPortions","delivered/portions/sum",typeof(int),4,2,
        [
            C("sum","Csak a Delivered rendelések Portions értékét összegzi; a nem fizetett is számít.",2,7,
                [O(1,portions:2,actual:15,paid:true),O(2,portions:5,actual:40),O(3,OrderStatus.Preparing,portions:40,actual:0),O(4,OrderStatus.Cancelled,portions:50,actual:0)]),
            C("single","Adagszámot ad vissza, nem rendelésdarabot vagy elkészítési időt.",1,4,[O(1,portions:4,actual:25)]),Empty(0)
        ]),
        new(4,"Beginner","maximum-price","Legnagyobb adagonkénti ár","GetMaximumUnitPriceAsync","GetMaximumUnitPrice","unit-price/max",typeof(decimal),4,2,
        [
            C("all-statuses","Minden állapotból a legnagyobb UnitPrice értéket keresi.",2,500.75m,
                [O(1,price:100),O(2,OrderStatus.Preparing,actual:0,price:200),O(3,OrderStatus.Received,actual:0,price:300),O(4,OrderStatus.Cancelled,actual:0,price:500.75m)]),
            C("single","Tört egységárat is pontosan ad vissza.",1,12.25m,[O(1,price:12.25m)]),Empty(0m)
        ]),
        new(5,"Medium","paid-revenue","Tényleges kedvezményes bevétel","GetPaidRevenueAsync","GetPaidRevenue","revenue/paid",typeof(decimal),6,4,
        [
            C("filter","Csak Delivered ÉS IsPaid rekordokból számol bevételt.",2,100m,
                [O(1,price:100,paid:true),O(2,price:1000),O(3,OrderStatus.Preparing,actual:0,price:2000,paid:true),
                 O(4,OrderStatus.Received,actual:0,price:3000,paid:true),O(5,OrderStatus.Cancelled,actual:0,price:4000,paid:true)]),
            C("formula","Portions × UnitPrice + DeliveryFee − DiscountAmount; a díj és kedvezmény rendelésenként egyszeri.",2,375m,
                [O(1,portions:2,price:100,fee:20,discount:10,paid:true),O(2,portions:3,price:50,fee:20,discount:5,paid:true)]),
            C("fraction","Tört pénzösszegekkel és kedvezménnyel is decimal pontossággal számol.",1,21.15m,
                [O(1,portions:2,price:10.25m,fee:.75m,discount:.10m,paid:true)]),
            C("no-match","Megfelelő rendelés nélkül 0.",.5m,0m,[O(1,price:100)]),Empty(0m,.5m)
        ]),
        new(6,"Medium","average-prep","Átlagos tényleges elkészítési idő","GetAverageDeliveredPrepMinutesAsync","GetAverageDeliveredPrepMinutes","delivered/prep-minutes/average",typeof(double),6,4,
        [
            C("filter","Csak a Delivered rendelések tényleges idejét átlagolja, nem a tervet vagy adagszámot.",2,30d,
                [O(1,planned:5,actual:20,portions:2),O(2,planned:7,actual:40,portions:4),
                 O(3,OrderStatus.Received,planned:200,actual:0),O(4,OrderStatus.Cancelled,planned:300,actual:0)]),
            C("fraction","Valós átlagot számol, nem egész osztást.",2,7d/3,[O(1,actual:1),O(2,actual:2),O(3,actual:4)]),
            C("unpaid","A nem fizetett, de kézbesített rendelés is számít.",1,3d,[O(1,actual:2,paid:true),O(2,actual:4)]),
            C("no-match","Kézbesített rendelés nélkül 0.",.5m,0d,[O(1,OrderStatus.Preparing,actual:0)]),Empty(0d,.5m)
        ]),
        new(7,"Medium","zone-count","Körzet és minimum adagszám szerinti darabszám","CountOrdersByZoneAsync","CountOrdersByZone","by-zone/count",typeof(int),6,4,
        [
            C("exact-zone","Pontos körzetegyezést használ, állapottól függetlenül.",2,3,
                [O(1,portions:3),O(2,OrderStatus.Preparing,portions:4,actual:0),O(3,OrderStatus.Cancelled,portions:5,actual:0),
                 O(4,portions:9,zone:"center"),O(5,portions:9,zone:"North"),O(6,portions:9,zone:"Center ")],"Center",3),
            C("boundary","A minimum határa is számít: Portions >= minPortions.",2,2,[O(1,portions:2),O(2,portions:3),O(3,portions:4)],"Center",3),
            C("arguments","A tényleges paramétereket használja, nem rögzített körzetet és minimumot.",1,1,
                [O(1,portions:4,zone:"North"),O(2,portions:5,zone:"North"),O(3,portions:10)],"North",5),
            C("no-match","Nem létező körzetre 0.",.5m,0,[O(1)],"West",1),Empty(0,.5m,"Center",1)
        ]),
        new(8,"Advanced","late-preparation","Késői elkészítések aránya","GetLatePreparationPercentageAsync","GetLatePreparationPercentage","delivered/late-percentage",typeof(double),9,5,
        [
            C("denominator","Csak Delivered rekordok a nevezőben; a fizetettség nem feltétel.",3,50d,
                [O(1,planned:30,actual:35,paid:true),O(2,planned:40,actual:40),O(3,OrderStatus.Preparing,actual:0),O(4,OrderStatus.Received,actual:0)]),
            C("strict-late","Pontos és korai elkészítés nem késés: csak ActualPrepMinutes > PlannedPrepMinutes.",2,100d/3,
                [O(1,planned:30,actual:40),O(2,planned:30,actual:30),O(3,planned:30,actual:20)]),
            C("fraction","A százalékot nem kerekíti és 0–100 skálán adja.",2,200d/3,
                [O(1,planned:10,actual:20),O(2,planned:20,actual:30),O(3,planned:40,actual:40)]),
            C("no-match","Kézbesített rekord nélkül 0, nincs nullával osztás.",1,0d,[O(1,OrderStatus.Cancelled,actual:0)]),Empty(0d)
        ]),
        new(9,"Advanced","profit","Összesített profit","GetTotalProfitAsync","GetTotalProfit","profit",typeof(decimal),9,5,
        [
            C("filter","Csak Delivered ÉS IsPaid rendelések profitja számít.",2,80m,
                [O(1,price:100,cost:20,paid:true),O(2,price:1000),O(3,OrderStatus.Preparing,actual:0,price:2000,paid:true),
                 O(4,OrderStatus.Received,actual:0,price:3000,paid:true),O(5,OrderStatus.Cancelled,actual:0,price:4000,paid:true)]),
            C("formula","Kedvezményes bevétel − Portions × CostPerPortion; minden díj és költség a helyes alapon.",3,130m,
                [O(1,portions:2,price:100,fee:20,discount:10,cost:40,paid:true)]),
            C("negative","A negatív összprofitot nem vágja 0-ra.",1,-200m,[O(1,portions:2,price:100,cost:200,paid:true)]),
            C("mixed","A veszteséget és nyereséget együtt összegzi.",1,-70m,
                [O(1,portions:2,price:100,fee:20,discount:10,cost:40,paid:true),O(2,portions:2,price:100,cost:200,paid:true)]),
            C("fraction","Tört díjakkal, kedvezménnyel és költségekkel is pontos.",1,12.65m,
                [O(1,portions:2,price:10.25m,fee:.75m,discount:.10m,cost:4.25m,paid:true)]),
            C("no-match","Megfelelő rendelés nélkül 0.",.5m,0m,[O(1,price:100)]),Empty(0m,.5m)
        ]),
        new(10,"Expert","zone-report","Kiszállítási körzet összesítő DTO-ja","GetZoneReportAsync","GetZoneReport","report",typeof(ZoneReportDto),12,6,
        [
            C("mixed","A DTO mind a hat mezőjét a körzet megfelelő részhalmazából számolja.",4,
                new ZoneReportDto{TotalCount=4,DeliveredCount=2,PaidDeliveredCount=2,RealizedRevenue=7600m,AveragePrepMinutes=40,LatePreparationPercentage=50},
                SampleData.CreateOrders().ToArray(),"Center"),
            C("zone","Pontos körzetet és aktuális paramétert használ; kisbetűs körzet külön érték.",2,
                new ZoneReportDto{TotalCount=1,DeliveredCount=1,PaidDeliveredCount=1,RealizedRevenue=2300m,AveragePrepMinutes=25},
                SampleData.CreateOrders().ToArray(),"center"),
            C("empty","Üres adatbázisra hat nulla mezőt tartalmazó, nem null DTO-t ad.",1,new ZoneReportDto(),[],"Center"),
            C("missing-zone","Létező adatok mellett is nulla DTO-t ad a nem létező körzetre.",1,new ZoneReportDto(),SampleData.CreateOrders().ToArray(),"West"),
            C("no-delivered","Nem kézbesített rendeléseknél csak TotalCount pozitív.",1,new ZoneReportDto{TotalCount=2},
                [O(1,OrderStatus.Preparing,actual:0,price:100,paid:true),O(2,OrderStatus.Received,actual:0,price:200)],"Center"),
            C("unpaid","Nem fizetett Delivered rendelés az átlagba és arányba számít, bevételbe nem.",1,
                new ZoneReportDto{TotalCount=2,DeliveredCount=2,AveragePrepMinutes=30,LatePreparationPercentage=50},
                [O(1,planned:15,actual:20,price:100),O(2,planned:40,actual:40,price:200)],"Center"),
            C("fraction","A DTO időátlagát és százalékát nem kerekíti; kedvezményes pénzadata pontos.",2,
                new ZoneReportDto{TotalCount=3,DeliveredCount=3,PaidDeliveredCount=1,RealizedRevenue=21.15m,AveragePrepMinutes=71d/3,LatePreparationPercentage=100d/3},
                [O(1,portions:2,planned:25,actual:30,price:10.25m,fee:.75m,discount:.1m,paid:true),
                 O(2,planned:20,actual:20),O(3,planned:30,actual:21)],"Center")
        ])
    ];

    internal static bool IsZero(object expected)=>expected switch
    {
        List<FoodOrder> list=>list.Count==0,
        ZoneReportDto r=>r.TotalCount==0 && r.DeliveredCount==0 && r.PaidDeliveredCount==0
            && r.RealizedRevenue==0 && r.AveragePrepMinutes==0 && r.LatePreparationPercentage==0,
        _=>Convert.ToDecimal(expected)==0
    };
}
