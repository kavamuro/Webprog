using Microsoft.EntityFrameworkCore;

namespace RentalStatisticsExam;

public class RentalQueryService(AppDbContext db)
{
    protected readonly AppDbContext Db = db;

    // 01. Beginner: kizárólag az Active állapotú kölcsönzések.
    public virtual async Task<List<Rental>> GetActiveRentalsAsync()
    {
        
        return await Db.Rentals.Where(x => x.Status == RentalStatus.Active).ToListAsync();
    }

    // 02. Beginner: a Completed rekordok darabszáma.
    public virtual async Task<int> CountCompletedRentalsAsync()
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return await Db.Rentals.Where(x => x.Status == RentalStatus.Completed).CountAsync();
    }

    // 03. Beginner: a Completed rekordok Days összege, fizetettségtől függetlenül.
    public virtual async Task<int> SumCompletedDaysAsync()
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return await Db.Rentals.Where(y => y.Status == RentalStatus.Completed).SumAsync(x => x.Days);
    }

    // 04. Beginner: minden rekord DailyRate maximuma; üres adatbázison 0.
    public virtual async Task<decimal> GetMaximumDailyRateAsync()
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return await Db.Rentals.MaxAsync(x => x.DailyRate);
    }

    // 05. Medium: Completed ÉS IsPaid; Days * DailyRate + ExtraFee összege.
    public virtual async Task<decimal> GetPaidRevenueAsync()
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return await Db.Rentals.Where(x => x.Status == RentalStatus.Completed && x.IsPaid).SumAsync(x => x.Days * x.DailyRate + x.ExtraFee);
    }

    // 06. Medium: minden Completed rekord Days átlaga; üres találati halmazon 0.
    public virtual async Task<double> GetAverageCompletedDaysAsync()
    {
        return await Db.Rentals.Where(x => x.Status == RentalStatus.Completed).AverageAsync(x => (double?)x.Days) ?? 0d;
    }

    // 07. Medium: pontos kategóriaegyezés ÉS Days >= minDays, minden állapotból.
    public virtual async Task<int> CountRentalsByCategoryAsync(string category, int minDays)
    {
        return await Db.Rentals.Where(x => x.Category == category && x.Days >= minDays).CountAsync();
    }

    // 08. Advanced: Completed között ActualDays > Days aránya, 0–100-as skálán.
    public virtual async Task<double> GetLateReturnPercentageAsync()
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return await Db.Rentals.Where(x => x.Status == RentalStatus.Completed && x.ActualDays > x.Days).CountAsync() * 100.0 / await Db.Rentals.Where(x => x.Status == RentalStatus.Completed).CountAsync();
    }

    // 09. Advanced: Completed ÉS IsPaid; Days * DailyRate + ExtraFee - Days * CostPerDay.
    public virtual Task<decimal> GetTotalProfitAsync()
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return Task.FromResult(0m);
    }

    // 10. Expert: először pontos kategóriaszűrés, utána a feladatlap szerinti DTO.
    public virtual Task<CategoryReportDto> GetCategoryReportAsync(string category)
    {
        // TODO: cseréld az alapértéket a feladat szerinti EF Core lekérdezésre.
        return Task.FromResult(new CategoryReportDto());
    }
}

