using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusMed.Application.Professionals;

namespace NexusMed.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfessionalsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] int skip = 0, [FromQuery] int take = 20, CancellationToken ct = default)
    {
        var useCase = HttpContext.RequestServices.GetRequiredService<ListProfessionalsUseCase>();
        var list = await useCase.ExecuteAsync(skip, take, ct);
        return Ok(list);
    }
}
