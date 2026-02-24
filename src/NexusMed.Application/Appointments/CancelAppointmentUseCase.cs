using NexusMed.Domain.Ports;

namespace NexusMed.Application.Appointments;

public class CancelAppointmentUseCase
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public CancelAppointmentUseCase(
        IAppointmentRepository appointmentRepository,
        IPatientProfileRepository patientProfileRepository,
        IProfessionalProfileRepository professionalProfileRepository)
    {
        _appointmentRepository = appointmentRepository;
        _patientProfileRepository = patientProfileRepository;
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task ExecuteAsync(Guid appointmentId, Guid userId, string role, string? reason, CancellationToken ct = default)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(appointmentId, ct)
            ?? throw new InvalidOperationException("Consulta não encontrada.");
        if (appointment.Status == "Cancelled")
            throw new InvalidOperationException("Consulta já está cancelada.");
        bool canCancel = false;
        if (role == "Patient")
        {
            var patient = await _patientProfileRepository.GetByUserIdAsync(userId, ct);
            canCancel = patient != null && appointment.PatientId == patient.Id;
        }
        else if (role == "Professional")
        {
            var professional = await _professionalProfileRepository.GetByUserIdAsync(userId, ct);
            canCancel = professional != null && appointment.ProfessionalId == professional.Id;
        }
        if (!canCancel)
            throw new UnauthorizedAccessException("Você não pode cancelar esta consulta.");
        appointment.Status = "Cancelled";
        appointment.CancelledAt = DateTime.UtcNow;
        appointment.CancellationReason = reason;
        appointment.UpdatedAt = DateTime.UtcNow;
        await _appointmentRepository.UpdateAsync(appointment, ct);
    }
}
