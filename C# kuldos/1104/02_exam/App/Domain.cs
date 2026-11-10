using Microsoft.EntityFrameworkCore;
namespace CateringStatisticsExam;

public enum OrderStatus { Received, Preparing, Delivered, Cancelled }
public sealed class FoodOrder
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = "";
    public string DeliveryZone { get; set; } = "";
    public OrderStatus Status { get; set; }
    public int Portions { get; set; }
    public int PlannedPrepMinutes { get; set; }
    public int ActualPrepMinutes { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal DeliveryFee { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal CostPerPortion { get; set; }
    public bool IsPaid { get; set; }
}
public sealed class ZoneReportDto
{
    public int TotalCount { get; set; }
    public int DeliveredCount { get; set; }
    public int PaidDeliveredCount { get; set; }
    public decimal RealizedRevenue { get; set; }
    public double AveragePrepMinutes { get; set; }
    public double LatePreparationPercentage { get; set; }
}
public class AppDbContext(DbContextOptions<AppDbContext> options):DbContext(options)
{
    public DbSet<FoodOrder> Orders=>Set<FoodOrder>();
}
