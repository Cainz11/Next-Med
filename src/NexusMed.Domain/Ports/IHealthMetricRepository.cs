using NexusMed.Domain.Entities;

namespace NexusMed.Domain.Ports;

public interface IHealthMetricRepository
{
    Task<HealthMetric?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<HealthMetric>> GetByPatientIdAsync(Guid patientId, DateTime? from, DateTime? to, CancellationToken ct = default);
    Task<HealthMetric> AddAsync(HealthMetric metric, CancellationToken ct = default);
    Task DeleteAsync(HealthMetric metric, CancellationToken ct = default);
}
