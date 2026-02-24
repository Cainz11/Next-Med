using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class AvailabilitySlotRepository : IAvailabilitySlotRepository
{
    private readonly AppDbContext _db;

    public AvailabilitySlotRepository(AppDbContext db) => _db = db;

    public async Task<AvailabilitySlot?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.AvailabilitySlots.FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<IReadOnlyList<AvailabilitySlot>> GetByProfessionalIdAsync(Guid professionalId, DateTime from, DateTime to, CancellationToken ct = default) =>
        await _db.AvailabilitySlots
            .Where(x => x.ProfessionalId == professionalId && x.StartAt >= from && x.StartAt <= to)
            .OrderBy(x => x.StartAt)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<AvailabilitySlot>> GetAvailableByProfessionalIdAsync(Guid professionalId, DateTime from, DateTime to, CancellationToken ct = default)
    {
        var bookedSlotIds = await _db.Appointments
            .Where(a => a.SlotId != null && a.Status != "Cancelled")
            .Select(a => a.SlotId!.Value)
            .ToListAsync(ct);
        return await _db.AvailabilitySlots
            .Where(x => x.ProfessionalId == professionalId && x.StartAt >= from && x.StartAt <= to && !bookedSlotIds.Contains(x.Id))
            .OrderBy(x => x.StartAt)
            .ToListAsync(ct);
    }

    public async Task<AvailabilitySlot> AddAsync(AvailabilitySlot slot, CancellationToken ct = default)
    {
        _db.AvailabilitySlots.Add(slot);
        await _db.SaveChangesAsync(ct);
        return slot;
    }

    public async Task AddRangeAsync(IEnumerable<AvailabilitySlot> slots, CancellationToken ct = default)
    {
        _db.AvailabilitySlots.AddRange(slots);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        await _db.AvailabilitySlots.Where(x => x.Id == id).ExecuteDeleteAsync(ct);
    }
}
