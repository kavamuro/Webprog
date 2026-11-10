using Microsoft.AspNetCore.Mvc;
namespace CateringStatisticsExam.Controllers;
// TODO: [ApiController] és [Route("api/orders")], az actionökre a megfelelő [HttpGet].
// A kapott konstruktorért, osztályvázért és aláírásokért önmagukban nem jár pont.
public class OrdersController(FoodOrderQueryService service):ControllerBase
{
    private readonly FoodOrderQueryService _service=service;
    // 01. GET api/orders/preparing
    public Task<ActionResult<List<FoodOrder>>> GetPreparingOrders()
        => Task.FromResult<ActionResult<List<FoodOrder>>>(StatusCode(501));
    // 02. GET api/orders/delivered/count
    public Task<ActionResult<int>> CountDeliveredOrders()
        => Task.FromResult<ActionResult<int>>(StatusCode(501));
    // 03. GET api/orders/delivered/portions/sum
    public Task<ActionResult<int>> SumDeliveredPortions()
        => Task.FromResult<ActionResult<int>>(StatusCode(501));
    // 04. GET api/orders/unit-price/max
    public Task<ActionResult<decimal>> GetMaximumUnitPrice()
        => Task.FromResult<ActionResult<decimal>>(StatusCode(501));
    // 05. GET api/orders/revenue/paid
    public Task<ActionResult<decimal>> GetPaidRevenue()
        => Task.FromResult<ActionResult<decimal>>(StatusCode(501));
    // 06. GET api/orders/delivered/prep-minutes/average
    public Task<ActionResult<double>> GetAverageDeliveredPrepMinutes()
        => Task.FromResult<ActionResult<double>>(StatusCode(501));
    // 07. GET api/orders/by-zone/count?zone=Center&minPortions=3
    // zone: kötelező, nem csak szóköz; minPortions >= 1, különben BadRequest.
    public Task<ActionResult<int>> CountOrdersByZone([FromQuery]string zone,[FromQuery]int minPortions)
        => Task.FromResult<ActionResult<int>>(StatusCode(501));
    // 08. GET api/orders/delivered/late-percentage
    public Task<ActionResult<double>> GetLatePreparationPercentage()
        => Task.FromResult<ActionResult<double>>(StatusCode(501));
    // 09. GET api/orders/profit
    public Task<ActionResult<decimal>> GetTotalProfit()
        => Task.FromResult<ActionResult<decimal>>(StatusCode(501));
    // 10. GET api/orders/report?zone=Center
    // zone: kötelező, nem csak szóköz; hibás értékre BadRequest.
    public Task<ActionResult<ZoneReportDto>> GetZoneReport([FromQuery]string zone)
        => Task.FromResult<ActionResult<ZoneReportDto>>(StatusCode(501));
}
