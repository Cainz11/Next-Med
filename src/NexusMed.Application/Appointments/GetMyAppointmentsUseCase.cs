using NexusMed.Domain.Ports;

namespace NexusMed.Application.Appointments;

public class GetMyAppointmentsUseCase
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public GetMyAppointmentsUseCase(
        IAppointmentRepository appointmentRepository,
        IPatientProfileRepository patientProfileRepository,
        IProfessionalProfileRepository professionalProfileRepository)
    {
        _appointmentRepository = appointmentRepository;
        _patientProfileRepository = patientProfileRepository;
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task<IReadOnlyList<AppointmentDto>> ExecuteAsync(Guid userId, string role, DateTime? from, DateTime? to, string? status, CancellationToken ct = default)
    {
        if (role == "Patient")
        {
            var patient = await _patientProfileRepository.GetByUserIdAsync(userId, ct)
                ?? throw new InvalidOperationException("Perfil de paciente não encontrado.");
            var list = await _appointmentRepository.GetByPatientIdAsync(patient.Id, from, to, status, ct);
            return list.Select(a => new AppointmentDto(
                a.Id, a.PatientId, a.ProfessionalId, a.SlotId, a.ScheduledAt, a.DurationMinutes, a.Status, a.AppointmentType, a.Notes,
                a.CreatedAt, a.CancelledAt, a.CancellationReason,
                PatientName: a.Patient?.FullName, ProfessionalName: a.Professional?.FullName)).ToList();
        }
        if (role == "Professional")
        {
            var professional = await _professionalProfileRepository.GetByUserIdAsync(userId, ct)
                ?? throw new InvalidOperationException("Perfil profissional não encontrado.");
            var list = await _appointmentRepository.GetByProfessionalIdAsync(professional.Id, from, to, status, ct);
            return list.Select(a => new AppointmentDto(
                a.Id, a.PatientId, a.ProfessionalId, a.SlotId, a.ScheduledAt, a.DurationMinutes, a.Status, a.AppointmentType, a.Notes,
                a.CreatedAt, a.CancelledAt, a.CancellationReason,
                PatientName: a.Patient?.FullName, ProfessionalName: a.Professional?.FullName)).ToList();
        }
        throw new InvalidOperationException("Perfil não suportado.");
    }
}

public record AppointmentDto(
    Guid Id, Guid PatientId, Guid ProfessionalId, Guid? SlotId, DateTime ScheduledAt, int DurationMinutes, string Status, string AppointmentType, string? Notes,
    DateTime CreatedAt, DateTime? CancelledAt, string? CancellationReason,
    string? PatientName, string? ProfessionalName);
