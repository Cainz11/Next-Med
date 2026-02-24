using NexusMed.Domain.Ports;

namespace NexusMed.Application.AvailabilitySlots;

public class GetMyAvailabilitySlotsUseCase
{
    private readonly IAvailabilitySlotRepository _slotRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public GetMyAvailabilitySlotsUseCase(
        IAvailabilitySlotRepository slotRepository,
        IProfessionalProfileRepository professionalProfileRepository)
    {
        _slotRepository = slotRepository;
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task<IReadOnlyList<SlotDto>> ExecuteAsync(Guid professionalUserId, DateTime from, DateTime to, CancellationToken ct = default)
    {
        var professional = await _professionalProfileRepository.GetByUserIdAsync(professionalUserId, ct)
            ?? throw new InvalidOperationException("Perfil profissional não encontrado.");
        var slots = await _slotRepository.GetByProfessionalIdAsync(professional.Id, from, to, ct);
        return slots.Select(s => new SlotDto(s.Id, s.ProfessionalId, s.StartAt, s.EndAt, s.SlotType, s.CreatedAt)).ToList();
    }
}

public record SlotDto(Guid Id, Guid ProfessionalId, DateTime StartAt, DateTime EndAt, string SlotType, DateTime CreatedAt);
