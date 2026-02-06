using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class HealthMetricRepository : IHealthMetricRepository
{
    private readonly AppDbContext _db;

    public HealthMetricRepository(AppDbContext db) => _db = db;

    public async Task<HealthMetric?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.HealthMetrics.FindAsync([id], ct);

    public async Task<IReadOnlyList<HealthMetric>> GetByPatientIdAsync(Guid patientId, DateTime? from, DateTime? to, CancellationToken ct = default)
    {
        var q = _db.HealthMetrics.Where(m => m.PatientId == patientId);
        if (from.HasValue) q = q.Where(m => m.RecordedAt >= from.Value);
        if (to.HasValue) q = q.Where(m => m.RecordedAt <= to.Value);
        return await q.OrderByDescending(m => m.RecordedAt).ToListAsync(ct);
    }

    public async Task<HealthMetric> AddAsync(HealthMetric metric, CancellationToken ct = default)
    {
        _db.HealthMetrics.Add(metric);
        await _db.SaveChangesAsync(ct);
        return metric;
    }

    public async Task DeleteAsync(HealthMetric metric, CancellationToken ct = default)
    {
        _db.HealthMetrics.Remove(metric);
        await _db.SaveChangesAsync(ct);
    }
}
