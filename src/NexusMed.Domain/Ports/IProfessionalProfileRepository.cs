using NexusMed.Domain.Entities;

namespace NexusMed.Domain.Ports;

public interface IProfessionalProfileRepository
{
    Task<ProfessionalProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<ProfessionalProfile?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<ProfessionalProfile> AddAsync(ProfessionalProfile profile, CancellationToken ct = default);
    Task UpdateAsync(ProfessionalProfile profile, CancellationToken ct = default);
    Task DeleteAsync(ProfessionalProfile profile, CancellationToken ct = default);
    Task<IReadOnlyList<ProfessionalProfile>> ListAsync(int skip, int take, CancellationToken ct = default);
}
