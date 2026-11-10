using Microsoft.EntityFrameworkCore;
namespace CateringStatisticsExam;
public class FoodOrderQueryService(AppDbContext db)
{
    protected readonly AppDbContext Db=db;
    // 01. Beginner: Preparing állapotú rendelések teljes adataikkal.
    public virtual Task<List<FoodOrder>> GetPreparingOrdersAsync()
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return Task.FromResult(new List<FoodOrder>());
    }
    // 02. Beginner: Delivered rekordok darabszáma.
    public virtual Task<int> CountDeliveredOrdersAsync()
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return Task.FromResult(0);
    }
    // 03. Beginner: Delivered rekordok Portions összege, fizetettségtől függetlenül.
    public virtual Task<int> SumDeliveredPortionsAsync()
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return Task.FromResult(0);
    }
    // 04. Beginner: minden állapotból a legnagyobb UnitPrice; üres adatbázison 0.
    public virtual Task<decimal> GetMaximumUnitPriceAsync()
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return Task.FromResult(0m);
    }
    // 05. Medium: Delivered ÉS IsPaid; Portions * UnitPrice + DeliveryFee - DiscountAmount.
    public virtual Task<decimal> GetPaidRevenueAsync()
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return Task.FromResult(0m);
    }
    // 06. Medium: Delivered rekordok ActualPrepMinutes átlaga; üres halmazon 0.
    public virtual Task<double> GetAverageDeliveredPrepMinutesAsync()
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return Task.FromResult(0d);
    }
    // 07. Medium: pontos DeliveryZone-egyezés ÉS Portions >= minPortions, minden állapotból.
    public virtual Task<int> CountOrdersByZoneAsync(string zone,int minPortions)
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return Task.FromResult(0);
    }
    // 08. Advanced: Delivered között ActualPrepMinutes > PlannedPrepMinutes aránya, százalékban.
    public virtual Task<double> GetLatePreparationPercentageAsync()
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return Task.FromResult(0d);
    }
    // 09. Advanced: Delivered ÉS IsPaid; bevétel - Portions * CostPerPortion, veszteséggel is.
    public virtual Task<decimal> GetTotalProfitAsync()
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return Task.FromResult(0m);
    }
    // 10. Expert: pontos körzetszűrés után a feladatlap szerinti hat mezős DTO.
    public virtual Task<ZoneReportDto> GetZoneReportAsync(string zone)
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return Task.FromResult(new ZoneReportDto());
    }
}

