using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.Appointments;

public class CreateAppointmentUseCase
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IAvailabilitySlotRepository _slotRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public CreateAppointmentUseCase(
        IAppointmentRepository appointmentRepository,
        IAvailabilitySlotRepository slotRepository,
        IPatientProfileRepository patientProfileRepository,
        IProfessionalProfileRepository professionalProfileRepository)
    {
        _appointmentRepository = appointmentRepository;
        _slotRepository = slotRepository;
        _patientProfileRepository = patientProfileRepository;
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task<Guid> ExecuteAsync(CreateAppointmentCommand command, Guid patientUserId, CancellationToken ct = default)
    {
        var patient = await _patientProfileRepository.GetByUserIdAsync(patientUserId, ct)
            ?? throw new InvalidOperationException("Perfil de paciente não encontrado.");
        var professional = await _professionalProfileRepository.GetByIdAsync(command.ProfessionalId, ct)
            ?? throw new InvalidOperationException("Profissional não encontrado.");
        Guid? slotId = null;
        DateTime scheduledAt;
        int durationMinutes = command.DurationMinutes ?? 30;
        string slotType = command.AppointmentType ?? "Presencial";
        if (command.SlotId.HasValue)
        {
            var slot = await _slotRepository.GetByIdAsync(command.SlotId.Value, ct)
                ?? throw new InvalidOperationException("Horário não encontrado.");
            if (slot.ProfessionalId != professional.Id)
                throw new InvalidOperationException("Horário não pertence ao profissional.");
            var hasActive = await _appointmentRepository.SlotHasActiveAppointmentAsync(slot.Id, ct);
            if (hasActive)
                throw new InvalidOperationException("Horário já está ocupado.");
            slotId = slot.Id;
            scheduledAt = slot.StartAt;
            durationMinutes = (int)(slot.EndAt - slot.StartAt).TotalMinutes;
            slotType = slot.SlotType;
        }
        else if (command.ScheduledAt.HasValue)
        {
            scheduledAt = command.ScheduledAt.Value;
        }
        else
            throw new InvalidOperationException("Informe SlotId ou ScheduledAt.");
        var appointment = new Appointment
        {
            Id = Guid.NewGuid(),
            PatientId = patient.Id,
            ProfessionalId = professional.Id,
            SlotId = slotId,
            ScheduledAt = scheduledAt,
            DurationMinutes = durationMinutes,
            Status = "Scheduled",
            AppointmentType = slotType,
            Notes = command.Notes,
            CreatedAt = DateTime.UtcNow
        };
        await _appointmentRepository.AddAsync(appointment, ct);
        return appointment.Id;
    }
}

public record CreateAppointmentCommand(Guid ProfessionalId, Guid? SlotId, DateTime? ScheduledAt, int? DurationMinutes, string? AppointmentType, string? Notes);
