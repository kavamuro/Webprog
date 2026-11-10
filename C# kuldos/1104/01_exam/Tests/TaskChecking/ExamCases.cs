using RentalStatisticsExam;

internal sealed record QueryCase(string Id, string Title, decimal Points, Rental[] Data, object Expected, object[] Args);
internal sealed record TaskSpec(int Number, string Level, string Id, string Title, string Method, string Action,
    string Path, Type ResultType, decimal ServiceMax, decimal ApiMax, QueryCase[] Cases);

internal static class ExamCases
{
    internal static Rental R(int id, RentalStatus status = RentalStatus.Completed, int days = 1,
        int actual = 1, decimal rate = 0, decimal fee = 0, decimal cost = 0,
        bool paid = false, string category = "Economy")
        => new() { Id=id, CustomerName=$"Vendég {id}", Category=category, Status=status, Days=days,
            ActualDays=actual, DailyRate=rate, ExtraFee=fee, CostPerDay=cost, IsPaid=paid };

    private static QueryCase C(string id, string title, decimal points, object expected, Rental[] data, params object[] args)
        => new(id,title,points,data,expected,args);
    private static QueryCase Empty(object expected, decimal points=1, params object[] args)
        => C("empty","Üres adatbázis esetén is helyes, kivétel nélkül.",points,expected,[],args);

    internal static IReadOnlyList<TaskSpec> All =>
    [
        new(1,"Beginner","active","Aktív kölcsönzések","GetActiveRentalsAsync","GetActiveRentals","active",typeof(List<Rental>),4,2,
        [
            C("mixed","Csak az Active rekordok teljes adatait adja vissza, fizetettségtől függetlenül.",2,
                new List<Rental>{R(1,RentalStatus.Active,days:2,actual:0,rate:100,paid:true),R(3,RentalStatus.Active,days:4,actual:0,rate:200)},
                [R(1,RentalStatus.Active,days:2,actual:0,rate:100,paid:true),R(2),R(3,RentalStatus.Active,days:4,actual:0,rate:200),
                 R(4,RentalStatus.Reserved,actual:0),R(5,RentalStatus.Cancelled,actual:0)]),
            C("no-match","Más állapotokból nem választ; nincs találat: üres lista.",1,new List<Rental>(),[R(1),R(2,RentalStatus.Reserved,actual:0)]),
            Empty(new List<Rental>())
        ]),
        new(2,"Beginner","completed-count","Befejezett kölcsönzések száma","CountCompletedRentalsAsync","CountCompletedRentals","completed/count",typeof(int),4,2,
        [
            C("mixed","A Completed rekordokat számolja, nem a fizetetteket vagy a napokat.",2,2,
                [R(1,days:7,paid:true),R(2,days:3),R(3,RentalStatus.Active,actual:0),R(4,RentalStatus.Cancelled,actual:0),R(5,RentalStatus.Reserved,actual:0)]),
            C("no-match","Befejezett rekord nélkül 0.",1,0,[R(1,RentalStatus.Active,actual:0)]),Empty(0)
        ]),
        new(3,"Beginner","completed-days","Befejezett napok összege","SumCompletedDaysAsync","SumCompletedDays","completed/days/sum",typeof(int),4,2,
        [
            C("sum","A Completed rekordok szerződéses Days értékét összegzi; a nem fizetett is számít.",2,7,
                [R(1,days:2,actual:3,paid:true),R(2,days:5,actual:8),R(3,RentalStatus.Active,days:40,actual:0),R(4,RentalStatus.Cancelled,days:50,actual:0)]),
            C("single","Egyetlen befejezett rekordnál a Days értéket adja, nem az ActualDays értéket.",1,4,[R(1,days:4,actual:7)]),
            Empty(0)
        ]),
        new(4,"Beginner","maximum-rate","Legnagyobb napidíj","GetMaximumDailyRateAsync","GetMaximumDailyRate","daily-rate/max",typeof(decimal),4,2,
        [
            C("all-statuses","Minden állapotból a legnagyobb DailyRate értéket keresi.",2,500.75m,
                [R(1,rate:100),R(2,RentalStatus.Active,actual:0,rate:200),R(3,RentalStatus.Reserved,actual:0,rate:300),
                 R(4,RentalStatus.Cancelled,actual:0,rate:500.75m)]),
            C("single","Tört napidíjat is pontosan ad vissza.",1,12.25m,[R(1,rate:12.25m)]),Empty(0m)
        ]),
        new(5,"Medium","paid-revenue","Tényleges bevétel","GetPaidRevenueAsync","GetPaidRevenue","revenue/paid",typeof(decimal),6,4,
        [
            C("filter","Csak Completed ÉS IsPaid rekordokból számol bevételt.",2,100m,
                [R(1,rate:100,paid:true),R(2,rate:1000),R(3,RentalStatus.Active,actual:0,rate:2000,paid:true),
                 R(4,RentalStatus.Reserved,actual:0,rate:3000,paid:true),R(5,RentalStatus.Cancelled,actual:0,rate:4000,paid:true)]),
            C("formula","Days × DailyRate + ExtraFee, foglalásonként egyszeri extra díjjal, több rekordból.",2,390m,
                [R(1,days:2,actual:4,rate:100,fee:20,paid:true),R(2,days:3,rate:50,fee:20,paid:true)]),
            C("fraction","Pénzösszegeket decimal pontossággal összegez.",1,21.25m,[R(1,days:2,rate:10.25m,fee:.75m,paid:true)]),
            C("no-match","Megfelelő rekord nélkül 0.",.5m,0m,[R(1,rate:100)]),Empty(0m,.5m)
        ]),
        new(6,"Medium","average-days","Átlagos befejezett időtartam","GetAverageCompletedDaysAsync","GetAverageCompletedDays","completed/days/average",typeof(double),6,4,
        [
            C("filter","Csak Completed szerződéses napok átlaga.",2,3d,
                [R(1,days:2,actual:8),R(2,days:4,actual:10),R(3,RentalStatus.Reserved,days:40,actual:0),R(4,RentalStatus.Cancelled,days:50,actual:0)]),
            C("fraction","Valós átlagot számol, nem egész osztást.",2,7d/3,[R(1,days:1),R(2,days:2),R(3,days:4)]),
            C("unpaid","A nem fizetett befejezett rekord is beleszámít.",1,3d,[R(1,days:2,paid:true),R(2,days:4)]),
            C("no-match","Befejezett rekord nélkül 0.",.5m,0d,[R(1,RentalStatus.Active,actual:0)]),Empty(0d,.5m)
        ]),
        new(7,"Medium","category-count","Kategória és minimum nap szerinti darabszám","CountRentalsByCategoryAsync","CountRentalsByCategory","by-category/count",typeof(int),6,4,
        [
            C("exact-category","Pontos kategóriaegyezést használ, állapottól függetlenül.",2,3,
                [R(1,days:3),R(2,RentalStatus.Active,days:4,actual:0),R(3,RentalStatus.Cancelled,days:5,actual:0),
                 R(4,days:9,category:"economy"),R(5,days:9,category:"SUV"),R(6,days:9,category:"Economy ")],"Economy",3),
            C("boundary","A minimum határa is számít: Days >= minDays.",2,2,
                [R(1,days:2),R(2,days:3),R(3,days:4)],"Economy",3),
            C("arguments","A tényleges paramétereket használja, nem rögzített kategóriát és minimumot.",1,1,
                [R(1,days:4,category:"SUV"),R(2,days:5,category:"SUV"),R(3,days:10)],"SUV",5),
            C("no-match","Nem létező kategóriára 0.",.5m,0,[R(1)],"Luxury",1),Empty(0,.5m,"Economy",1)
        ]),
        new(8,"Advanced","late-percentage","Késő visszahozások aránya","GetLateReturnPercentageAsync","GetLateReturnPercentage","completed/late-percentage",typeof(double),9,5,
        [
            C("denominator","Csak Completed rekordok a nevezőben; a fizetettség nem feltétel.",3,50d,
                [R(1,days:2,actual:3,paid:true),R(2,days:3,actual:3),R(3,RentalStatus.Active,actual:0),R(4,RentalStatus.Reserved,actual:0)]),
            C("strict-late","A pontos és korai visszahozás nem késés; csak ActualDays > Days.",2,100d/3,
                [R(1,days:3,actual:4),R(2,days:3,actual:3),R(3,days:3,actual:2)]),
            C("fraction","A százalékot nem kerekíti és 0–100 skálán adja.",2,200d/3,
                [R(1,days:1,actual:2),R(2,days:2,actual:3),R(3,days:4,actual:4)]),
            C("no-match","Befejezett rekord nélkül 0, nincs nullával osztás.",1,0d,[R(1,RentalStatus.Cancelled,actual:0)]),Empty(0d)
        ]),
        new(9,"Advanced","profit","Összesített profit","GetTotalProfitAsync","GetTotalProfit","profit",typeof(decimal),9,5,
        [
            C("filter","Csak Completed ÉS IsPaid rekordok profitja számít.",2,80m,
                [R(1,rate:100,cost:20,paid:true),R(2,rate:1000),R(3,RentalStatus.Active,actual:0,rate:2000,paid:true),
                 R(4,RentalStatus.Reserved,actual:0,rate:3000,paid:true),R(5,RentalStatus.Cancelled,actual:0,rate:4000,paid:true)]),
            C("formula","Szerződéses napokkal: Days × DailyRate + ExtraFee − Days × CostPerDay.",3,140m,
                [R(1,days:2,actual:5,rate:100,fee:20,cost:40,paid:true)]),
            C("negative","A negatív összprofitot nem vágja 0-ra.",1,-200m,[R(1,days:2,rate:100,cost:200,paid:true)]),
            C("mixed","A veszteséget és nyereséget együtt összegzi.",1,-60m,
                [R(1,days:2,rate:100,fee:20,cost:40,paid:true),R(2,days:2,rate:100,cost:200,paid:true)]),
            C("fraction","Tört díjakkal és költségekkel is pontos.",1,12.75m,[R(1,days:2,rate:10.25m,fee:.75m,cost:4.25m,paid:true)]),
            C("no-match","Megfelelő rekord nélkül 0.",.5m,0m,[R(1,rate:100)]),Empty(0m,.5m)
        ]),
        new(10,"Expert","category-report","Kategóriánkénti összesítő DTO","GetCategoryReportAsync","GetCategoryReport","report",typeof(CategoryReportDto),12,6,
        [
            C("mixed","Minden DTO mezőt a kategória megfelelő részhalmazából számol.",4,
                new CategoryReportDto {TotalCount=4,CompletedCount=2,PaidCompletedCount=2,RealizedRevenue=820m,AverageCompletedDays=3,LateReturnPercentage=50},
                SampleData.CreateRentals().ToArray(),"Economy"),
            C("category","Pontos kategóriát és aktuális paramétert használ; kisbetűs kategória külön érték.",2,
                new CategoryReportDto {TotalCount=1,CompletedCount=1,PaidCompletedCount=1,RealizedRevenue=240m,AverageCompletedDays=2,LateReturnPercentage=0},
                SampleData.CreateRentals().ToArray(),"economy"),
            C("empty","Üres adatbázisra nem null DTO-t, hanem hat nulla mezőt ad.",1,new CategoryReportDto(),[],"Economy"),
            C("missing-category","Létező adatok mellett is nulla DTO-t ad a nem létező kategóriára.",1,new CategoryReportDto(),SampleData.CreateRentals().ToArray(),"Luxury"),
            C("no-completed","Nem befejezett rekordoknál csak TotalCount pozitív.",1,new CategoryReportDto {TotalCount=2},
                [R(1,RentalStatus.Active,actual:0,rate:100,paid:true),R(2,RentalStatus.Reserved,actual:0,rate:200)],"Economy"),
            C("unpaid","Nem fizetett Completed rekordok az átlagba és arányba számítanak, bevételbe nem.",1,
                new CategoryReportDto {TotalCount=2,CompletedCount=2,AverageCompletedDays=2,LateReturnPercentage=50},
                [R(1,days:1,actual:2,rate:100),R(2,days:3,actual:3,rate:200)],"Economy"),
            C("fraction","A DTO átlagát és százalékát nem kerekíti, pénzadata pontos.",2,
                new CategoryReportDto {TotalCount=3,CompletedCount=3,PaidCompletedCount=1,RealizedRevenue=21.25m,AverageCompletedDays=7d/3,LateReturnPercentage=100d/3},
                [R(1,days:2,actual:3,rate:10.25m,fee:.75m,paid:true),R(2,days:1),R(3,days:4,actual:4)],"Economy")
        ])
    ];

    internal static bool IsZero(object expected) => expected switch
    {
        List<Rental> list => list.Count==0,
        CategoryReportDto report => report.TotalCount==0 && report.CompletedCount==0 && report.PaidCompletedCount==0
            && report.RealizedRevenue==0 && report.AverageCompletedDays==0 && report.LateReturnPercentage==0,
        _ => Convert.ToDecimal(expected)==0
    };
}

