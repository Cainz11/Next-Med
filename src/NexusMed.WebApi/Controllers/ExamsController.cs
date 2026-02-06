using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusMed.Application.Exams;

namespace NexusMed.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExamsController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateExamRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var command = new CreateExamCommand(request.PatientId, request.Name, request.FilePath, request.ExamDate, request.RequestedByProfessionalId);
        var useCase = HttpContext.RequestServices.GetRequiredService<CreateExamUseCase>();
        var id = await useCase.ExecuteAsync(command, userId, HttpContext.Connection.RemoteIpAddress?.ToString(), ct);
        return CreatedAtAction(nameof(GetAll), new { patientId = request.PatientId }, new { id });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? patientId, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var useCase = HttpContext.RequestServices.GetRequiredService<GetExamsUseCase>();
        var list = await useCase.ExecuteAsync(userId, role, patientId, HttpContext.Connection.RemoteIpAddress?.ToString(), ct);
        return Ok(list.Select(e => new { e.Id, e.PatientId, e.Name, e.FilePath, e.ExamDate, e.CreatedAt }));
    }
}

public record CreateExamRequest(Guid PatientId, string? Name, string? FilePath, DateTime? ExamDate, Guid? RequestedByProfessionalId);
