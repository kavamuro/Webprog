using Microsoft.AspNetCore.Mvc;

namespace RentalStatisticsExam.Controllers;

// TODO: tedd rá az [ApiController] és [Route("api/rentals")] attribútumokat.
// A konstruktor és a metódusaláírások adottak; ezekre önmagukban nem jár pont.
[ApiController]
[Route("api/rentals")]
public class RentalsController(RentalQueryService service) : ControllerBase
{
    private readonly RentalQueryService _service = service;

    // 01. GET api/rentals/active
    [HttpGet("active")]
    public async Task<ActionResult<List<Rental>>> GetActiveRentals()
    {
        var result = await _service.GetActiveRentalsAsync();
        return Ok(result);
    }

    // 02. GET api/rentals/completed/count
    [HttpGet("completed/count")]
    public async Task<ActionResult<int>> CountCompletedRentals()
    {
        var resault = await _service.CountCompletedRentalsAsync();
        return Ok(resault);
    }

    // 03. GET api/rentals/completed/days/sum
    [HttpGet("completed/days/sum")]

    public async Task<ActionResult<int>> SumCompletedDays()
    {
        var resault = await _service.SumCompletedDaysAsync();
        return Ok(resault);
    }

    // 04. GET api/rentals/daily-rate/max
    [HttpGet("daily-rate/max")]
    public async Task<ActionResult<decimal>> GetMaximumDailyRate()
    {
        var result = await _service.GetMaximumDailyRateAsync();
        return Ok(result);
    }

    // 05. GET api/rentals/revenue/paid
    [HttpGet("revenue/paid")]
    public async Task<ActionResult<decimal>> GetPaidRevenue()
    {
        var result = await _service.GetTotalProfitAsync();
        return Ok(result);
    }

    // 06. GET api/rentals/completed/days/average
    [HttpGet("completed/days/average")]
    public async Task<ActionResult<double>> GetAverageCompletedDays()
    {
        var result = await _service.GetAverageCompletedDaysAsync();
        return Ok(result);
    }

    // 07. GET api/rentals/by-category/count?category=Economy&minDays=3
    // category: kötelező, nem csak szóköz; minDays >= 1, különben BadRequest.
    [HttpGet("by-category/count?category=SUV&minDays=3")]
    public async Task<ActionResult<int>> CountRentalsByCategory([FromQuery] string category, [FromQuery] int minDays)
    {
        var result = await _service.CountRentalsByCategoryAsync(category, minDays);
        return Ok(result);
    }

    // 08. GET api/rentals/completed/late-percentage
    public async Task<ActionResult<double>> GetLateReturnPercentage()
    {
        var result = await _service.GetLateReturnPercentageAsync();
        return Ok(result);
    }

    // 09. GET api/rentals/profit
    public Task<ActionResult<decimal>> GetTotalProfit()
        => Task.FromResult<ActionResult<decimal>>(StatusCode(501));

    // 10. GET api/rentals/report?category=Economy
    // category: kötelező, nem csak szóköz; hibás értékre BadRequest.
    public Task<ActionResult<CategoryReportDto>> GetCategoryReport([FromQuery] string category)
        => Task.FromResult<ActionResult<CategoryReportDto>>(StatusCode(501));
}
