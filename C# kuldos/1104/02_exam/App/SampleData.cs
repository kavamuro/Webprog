namespace CateringStatisticsExam;
public static class SampleData
{
    public static List<FoodOrder> CreateOrders() =>
    [
        new() { Id=1,CustomerName="Anna",DeliveryZone="Center",Status=OrderStatus.Preparing,Portions=2,PlannedPrepMinutes=30,ActualPrepMinutes=0,UnitPrice=1000m,DeliveryFee=100m,DiscountAmount=50m,CostPerPortion=400m,IsPaid=true },
        new() { Id=2,CustomerName="Béla",DeliveryZone="Center",Status=OrderStatus.Delivered,Portions=2,PlannedPrepMinutes=30,ActualPrepMinutes=35,UnitPrice=1000m,DeliveryFee=200m,DiscountAmount=100m,CostPerPortion=400m,IsPaid=true },
        new() { Id=3,CustomerName="Csilla",DeliveryZone="Center",Status=OrderStatus.Delivered,Portions=4,PlannedPrepMinutes=45,ActualPrepMinutes=45,UnitPrice=1500m,DeliveryFee=0m,DiscountAmount=500m,CostPerPortion=2000m,IsPaid=true },
        new() { Id=4,CustomerName="Dávid",DeliveryZone="North",Status=OrderStatus.Delivered,Portions=1,PlannedPrepMinutes=20,ActualPrepMinutes=18,UnitPrice=3000m,DeliveryFee=500m,DiscountAmount=0m,CostPerPortion=1000m,IsPaid=true },
        new() { Id=5,CustomerName="Emese",DeliveryZone="North",Status=OrderStatus.Delivered,Portions=3,PlannedPrepMinutes=40,ActualPrepMinutes=55,UnitPrice=2000m,DeliveryFee=300m,DiscountAmount=200m,CostPerPortion=800m,IsPaid=false },
        new() { Id=6,CustomerName="Ferenc",DeliveryZone="Center",Status=OrderStatus.Received,Portions=5,PlannedPrepMinutes=35,ActualPrepMinutes=0,UnitPrice=900m,DeliveryFee=0m,DiscountAmount=0m,CostPerPortion=300m,IsPaid=true },
        new() { Id=7,CustomerName="Gabriella",DeliveryZone="East",Status=OrderStatus.Cancelled,Portions=9,PlannedPrepMinutes=60,ActualPrepMinutes=0,UnitPrice=5000m,DeliveryFee=990m,DiscountAmount=0m,CostPerPortion=1000m,IsPaid=true },
        new() { Id=8,CustomerName="Hunor",DeliveryZone="North",Status=OrderStatus.Preparing,Portions=3,PlannedPrepMinutes=40,ActualPrepMinutes=0,UnitPrice=2500m,DeliveryFee=100m,DiscountAmount=0m,CostPerPortion=900m,IsPaid=false },
        new() { Id=9,CustomerName="Ilona",DeliveryZone="East",Status=OrderStatus.Delivered,Portions=1,PlannedPrepMinutes=15,ActualPrepMinutes=15,UnitPrice=800m,DeliveryFee=50m,DiscountAmount=0m,CostPerPortion=200m,IsPaid=true },
        new() { Id=10,CustomerName="János",DeliveryZone="center",Status=OrderStatus.Delivered,Portions=2,PlannedPrepMinutes=25,ActualPrepMinutes=25,UnitPrice=1200m,DeliveryFee=0m,DiscountAmount=100m,CostPerPortion=500m,IsPaid=true }
    ];
    public static void Seed(AppDbContext db)
    {
        if(db.Orders.Count()>0) return;
        db.Orders.AddRange(CreateOrders());
        db.SaveChanges();
    }
}
