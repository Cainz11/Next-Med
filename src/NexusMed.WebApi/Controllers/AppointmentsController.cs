using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusMed.Application.Appointments;
using NexusMed.Application.Notifications;
using NexusMed.Domain.Ports;

namespace NexusMed.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    [HttpGet("available-slots")]
    public async Task<IActionResult> GetAvailableSlots([FromQuery] Guid professionalId, [FromQuery] DateTime from, [FromQuery] DateTime to, CancellationToken ct)
    {
        var useCase = HttpContext.RequestServices.GetRequiredService<GetAvailableSlotsUseCase>();
        var list = await useCase.ExecuteAsync(professionalId, from, to, ct);
        return Ok(list);
    }

    [HttpGet]
    public async Task<IActionResult> GetMy([FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] string? status, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var useCase = HttpContext.RequestServices.GetRequiredService<GetMyAppointmentsUseCase>();
        var list = await useCase.ExecuteAsync(userId, role, from, to, status, ct);
        return Ok(list);
    }

    [HttpPost]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> Create([FromBody] CreateAppointmentRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<CreateAppointmentUseCase>();
        var command = new CreateAppointmentCommand(request.ProfessionalId, request.SlotId, request.ScheduledAt, request.DurationMinutes, request.AppointmentType, request.Notes);
        var id = await useCase.ExecuteAsync(command, userId, ct);
        var appointmentRepo = HttpContext.RequestServices.GetRequiredService<IAppointmentRepository>();
        var patientRepo = HttpContext.RequestServices.GetRequiredService<IPatientProfileRepository>();
        var appointment = await appointmentRepo.GetByIdAsync(id, ct);
        if (appointment != null)
        {
            var patient = await patientRepo.GetByIdAsync(appointment.PatientId, ct);
            if (patient?.UserId != null)
            {
                var createNotif = HttpContext.RequestServices.GetRequiredService<CreateNotificationUseCase>();
                await createNotif.ExecuteAsync(patient.UserId, "Consulta agendada", $"Sua consulta foi agendada para {appointment.ScheduledAt:dd/MM/yyyy HH:mm}.", "AppointmentScheduled", appointment.Id.ToString(), "Appointment", ct);
            }
        }
        return CreatedAtAction(nameof(GetMy), new { id }, new { id });
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid id, [FromBody] CancelAppointmentRequest? request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var useCase = HttpContext.RequestServices.GetRequiredService<CancelAppointmentUseCase>();
        await useCase.ExecuteAsync(id, userId, role, request?.Reason, ct);
        var appointmentRepo = HttpContext.RequestServices.GetRequiredService<IAppointmentRepository>();
        var appointment = await appointmentRepo.GetByIdAsync(id, ct);
        if (appointment != null)
        {
            var patientRepo = HttpContext.RequestServices.GetRequiredService<IPatientProfileRepository>();
            var patient = await patientRepo.GetByIdAsync(appointment.PatientId, ct);
            var professional = appointment.Professional;
            if (role == "Patient" && professional?.UserId != null)
                await NotifyUser(professional.UserId, "Consulta cancelada", $"O paciente cancelou a consulta de {appointment.ScheduledAt:dd/MM/yyyy HH:mm}.", id, ct);
            else if (role == "Professional" && patient?.UserId != null)
                await NotifyUser(patient.UserId, "Consulta cancelada", $"Sua consulta de {appointment.ScheduledAt:dd/MM/yyyy HH:mm} foi cancelada pelo profissional.", id, ct);
        }
        return NoContent();
    }

    private async Task NotifyUser(Guid userId, string title, string body, Guid appointmentId, CancellationToken ct)
    {
        var createNotif = HttpContext.RequestServices.GetRequiredService<CreateNotificationUseCase>();
        await createNotif.ExecuteAsync(userId, title, body, "AppointmentCancelled", appointmentId.ToString(), "Appointment", ct);
    }
}

public record CreateAppointmentRequest(Guid ProfessionalId, Guid? SlotId, DateTime? ScheduledAt, int? DurationMinutes, string? AppointmentType, string? Notes);
public record CancelAppointmentRequest(string? Reason);
