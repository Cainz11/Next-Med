using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusMed.Application.Patients;

namespace NexusMed.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PatientsController : ControllerBase
{
    /// <summary>
    /// Lista de pacientes com quem o profissional já interagiu (prescrições, conversas ou exames).
    /// Apenas para role Professional.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> ListMyPatients([FromQuery] bool all = false, CancellationToken ct = default)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        if (role != "Professional")
            return Forbid();
        var useCase = HttpContext.RequestServices.GetRequiredService<ListMyPatientsUseCase>();
        var list = await useCase.ExecuteAsync(userId, all, ct);
        return Ok(list);
    }
}
