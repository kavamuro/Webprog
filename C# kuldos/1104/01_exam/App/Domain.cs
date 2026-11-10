using Microsoft.EntityFrameworkCore;

namespace RentalStatisticsExam;

public enum RentalStatus { Reserved, Active, Completed, Cancelled }

public sealed class Rental
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = "";
    public string Category { get; set; } = "";
    public RentalStatus Status { get; set; }
    public int Days { get; set; }
    public int ActualDays { get; set; }
    public decimal DailyRate { get; set; }
    public decimal ExtraFee { get; set; }
    public decimal CostPerDay { get; set; }
    public bool IsPaid { get; set; }
}

public sealed class CategoryReportDto
{
    public int TotalCount { get; set; }
    public int CompletedCount { get; set; }
    public int PaidCompletedCount { get; set; }
    public decimal RealizedRevenue { get; set; }
    public double AverageCompletedDays { get; set; }
    public double LateReturnPercentage { get; set; }
}

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Rental> Rentals => Set<Rental>();
}
