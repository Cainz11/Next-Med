using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.AvailabilitySlots;

public class CreateAvailabilitySlotsUseCase
{
    private readonly IAvailabilitySlotRepository _slotRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public CreateAvailabilitySlotsUseCase(
        IAvailabilitySlotRepository slotRepository,
        IProfessionalProfileRepository professionalProfileRepository)
    {
        _slotRepository = slotRepository;
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task<IReadOnlyList<Guid>> ExecuteAsync(CreateAvailabilitySlotsCommand command, Guid professionalUserId, CancellationToken ct = default)
    {
        var professional = await _professionalProfileRepository.GetByUserIdAsync(professionalUserId, ct)
            ?? throw new InvalidOperationException("Perfil profissional não encontrado.");
        var ids = new List<Guid>();
        foreach (var item in command.Slots)
        {
            var slot = new AvailabilitySlot
            {
                Id = Guid.NewGuid(),
                ProfessionalId = professional.Id,
                StartAt = item.StartAt,
                EndAt = item.EndAt,
                SlotType = item.SlotType ?? "Presencial",
                CreatedAt = DateTime.UtcNow
            };
            await _slotRepository.AddAsync(slot, ct);
            ids.Add(slot.Id);
        }
        return ids;
    }
}

public record CreateAvailabilitySlotsCommand(IReadOnlyList<SlotItem> Slots);
public record SlotItem(DateTime StartAt, DateTime EndAt, string? SlotType);
