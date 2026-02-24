using NexusMed.Domain.Ports;

namespace NexusMed.Application.AvailabilitySlots;

public class DeleteAvailabilitySlotUseCase
{
    private readonly IAvailabilitySlotRepository _slotRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public DeleteAvailabilitySlotUseCase(
        IAvailabilitySlotRepository slotRepository,
        IAppointmentRepository appointmentRepository,
        IProfessionalProfileRepository professionalProfileRepository)
    {
        _slotRepository = slotRepository;
        _appointmentRepository = appointmentRepository;
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task ExecuteAsync(Guid slotId, Guid professionalUserId, CancellationToken ct = default)
    {
        var professional = await _professionalProfileRepository.GetByUserIdAsync(professionalUserId, ct)
            ?? throw new InvalidOperationException("Perfil profissional não encontrado.");
        var slot = await _slotRepository.GetByIdAsync(slotId, ct)
            ?? throw new InvalidOperationException("Slot não encontrado.");
        if (slot.ProfessionalId != professional.Id)
            throw new UnauthorizedAccessException("Slot não pertence ao profissional.");
        var hasActive = await _appointmentRepository.SlotHasActiveAppointmentAsync(slotId, ct);
        if (hasActive)
            throw new InvalidOperationException("Não é possível excluir slot com consulta agendada.");
        await _slotRepository.DeleteAsync(slotId, ct);
    }
}
