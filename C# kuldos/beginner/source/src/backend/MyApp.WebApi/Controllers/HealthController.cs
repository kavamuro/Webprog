using Microsoft.AspNetCore.Mvc;
using MyApp.Shared.Models;

namespace MyApp.WebApi.Controllers;

[Route("api/health")]
[ApiController]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new HealthResponse { Status = "ok" });
    }
}
