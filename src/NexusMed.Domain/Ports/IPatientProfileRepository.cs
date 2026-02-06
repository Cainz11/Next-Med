using NexusMed.Domain.Entities;

namespace NexusMed.Domain.Ports;

public interface IPatientProfileRepository
{
    Task<PatientProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<PatientProfile?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<PatientProfile>> ListAllAsync(CancellationToken ct = default);
    Task<PatientProfile> AddAsync(PatientProfile profile, CancellationToken ct = default);
    Task UpdateAsync(PatientProfile profile, CancellationToken ct = default);
    Task DeleteAsync(PatientProfile profile, CancellationToken ct = default);
}
