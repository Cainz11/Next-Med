using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusMed.Application.ClinicalNotes;

namespace NexusMed.WebApi.Controllers;

[ApiController]
[Route("api/clinical-notes")]
[Authorize]
public class ClinicalNotesController : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "Professional")]
    public async Task<IActionResult> Create([FromBody] CreateClinicalNoteRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<CreateClinicalNoteUseCase>();
        var command = new CreateClinicalNoteCommand(request.PatientId, request.AppointmentId, request.Content, request.NoteType);
        var id = await useCase.ExecuteAsync(command, userId, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Professional")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateClinicalNoteRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<UpdateClinicalNoteUseCase>();
        await useCase.ExecuteAsync(id, userId, request.Content, ct);
        return NoContent();
    }

    [HttpGet]
    [Authorize(Roles = "Professional")]
    public async Task<IActionResult> GetByPatient([FromQuery] Guid patientId, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<GetClinicalNotesByPatientUseCase>();
        var list = await useCase.ExecuteAsync(patientId, userId, ct);
        return Ok(list);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var useCase = HttpContext.RequestServices.GetRequiredService<GetClinicalNoteByIdUseCase>();
        var note = await useCase.ExecuteAsync(id, userId, role, ct);
        if (note == null) return NotFound();
        return Ok(note);
    }
}

public record CreateClinicalNoteRequest(Guid PatientId, Guid? AppointmentId, string? Content, string? NoteType);
public record UpdateClinicalNoteRequest(string Content);
