using Microsoft.AspNetCore.Mvc;
using MyApp.Shared.Models;

namespace MyApp.WebApi.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public ActionResult<HealthResponse> Get()
    {
        return Ok(new HealthResponse { Status = "ok" });
    }
}
