using NexusMed.Application.AvailabilitySlots;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.Appointments;

public class GetAvailableSlotsUseCase
{
    private readonly IAvailabilitySlotRepository _slotRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public GetAvailableSlotsUseCase(
        IAvailabilitySlotRepository slotRepository,
        IProfessionalProfileRepository professionalProfileRepository)
    {
        _slotRepository = slotRepository;
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task<IReadOnlyList<SlotDto>> ExecuteAsync(Guid professionalId, DateTime from, DateTime to, CancellationToken ct = default)
    {
        _ = await _professionalProfileRepository.GetByIdAsync(professionalId, ct)
            ?? throw new InvalidOperationException("Profissional não encontrado.");
        var slots = await _slotRepository.GetAvailableByProfessionalIdAsync(professionalId, from, to, ct);
        return slots.Select(s => new SlotDto(s.Id, s.ProfessionalId, s.StartAt, s.EndAt, s.SlotType, s.CreatedAt)).ToList();
    }
}
