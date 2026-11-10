namespace RentalStatisticsExam;

public static class SampleData
{
    public static List<Rental> CreateRentals() =>
    [
        new() { Id=1, CustomerName="Anna", Category="Economy", Status=RentalStatus.Active, Days=2, ActualDays=0, DailyRate=100m, ExtraFee=10m, CostPerDay=40m, IsPaid=true },
        new() { Id=2, CustomerName="Béla", Category="Economy", Status=RentalStatus.Completed, Days=2, ActualDays=3, DailyRate=100m, ExtraFee=20m, CostPerDay=40m, IsPaid=true },
        new() { Id=3, CustomerName="Csilla", Category="Economy", Status=RentalStatus.Completed, Days=4, ActualDays=4, DailyRate=150m, ExtraFee=0m, CostPerDay=200m, IsPaid=true },
        new() { Id=4, CustomerName="Dávid", Category="SUV", Status=RentalStatus.Completed, Days=1, ActualDays=1, DailyRate=300m, ExtraFee=50m, CostPerDay=100m, IsPaid=true },
        new() { Id=5, CustomerName="Emese", Category="SUV", Status=RentalStatus.Completed, Days=3, ActualDays=5, DailyRate=200m, ExtraFee=30m, CostPerDay=80m, IsPaid=false },
        new() { Id=6, CustomerName="Ferenc", Category="Economy", Status=RentalStatus.Reserved, Days=5, ActualDays=0, DailyRate=90m, ExtraFee=0m, CostPerDay=30m, IsPaid=true },
        new() { Id=7, CustomerName="Gabriella", Category="Van", Status=RentalStatus.Cancelled, Days=9, ActualDays=0, DailyRate=500m, ExtraFee=99m, CostPerDay=100m, IsPaid=true },
        new() { Id=8, CustomerName="Hunor", Category="SUV", Status=RentalStatus.Active, Days=3, ActualDays=0, DailyRate=250m, ExtraFee=10m, CostPerDay=90m, IsPaid=false },
        new() { Id=9, CustomerName="Ilona", Category="Van", Status=RentalStatus.Completed, Days=1, ActualDays=1, DailyRate=80m, ExtraFee=5m, CostPerDay=20m, IsPaid=true },
        new() { Id=10, CustomerName="János", Category="economy", Status=RentalStatus.Completed, Days=2, ActualDays=2, DailyRate=120m, ExtraFee=0m, CostPerDay=50m, IsPaid=true }
    ];

    public static void Seed(AppDbContext db)
    {
        if (db.Rentals.Count() > 0) return;
        db.Rentals.AddRange(CreateRentals());
        db.SaveChanges();
    }
}
