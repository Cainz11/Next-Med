using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusMed.Application.Prescriptions;

namespace NexusMed.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PrescriptionsController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePrescriptionRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        if (role != "Professional")
            return Forbid();
        var command = new CreatePrescriptionCommand(request.PatientId, request.Description, request.FilePath);
        var useCase = HttpContext.RequestServices.GetRequiredService<CreatePrescriptionUseCase>();
        var id = await useCase.ExecuteAsync(command, userId, HttpContext.Connection.RemoteIpAddress?.ToString(), ct);
        return CreatedAtAction(nameof(GetAll), new { id }, new { id });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var useCase = HttpContext.RequestServices.GetRequiredService<GetPrescriptionsUseCase>();
        var list = await useCase.ExecuteAsync(userId, role, HttpContext.Connection.RemoteIpAddress?.ToString(), ct);
        return Ok(list.Select(p => new { p.Id, p.PatientId, p.ProfessionalId, p.Description, p.FilePath, p.IssuedAt, p.CreatedAt }));
    }
}

public record CreatePrescriptionRequest(Guid PatientId, string? Description, string? FilePath);
