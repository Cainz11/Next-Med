using NexusMed.Domain.Entities;

namespace NexusMed.Domain.Ports;

public interface IAvailabilitySlotRepository
{
    Task<AvailabilitySlot?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<AvailabilitySlot>> GetByProfessionalIdAsync(Guid professionalId, DateTime from, DateTime to, CancellationToken ct = default);
    Task<IReadOnlyList<AvailabilitySlot>> GetAvailableByProfessionalIdAsync(Guid professionalId, DateTime from, DateTime to, CancellationToken ct = default);
    Task<AvailabilitySlot> AddAsync(AvailabilitySlot slot, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<AvailabilitySlot> slots, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
