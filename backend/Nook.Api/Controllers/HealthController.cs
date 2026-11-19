
using Microsoft.AspNetCore.Mvc;

namespace Nook.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "healthy",
            application = "Nook API",
            message = "Nook backend is running!",
            timestamp = DateTime.UtcNow
        });
    }
}

