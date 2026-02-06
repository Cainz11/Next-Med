using NexusMed.Domain.Entities;

namespace NexusMed.Domain.Ports;

public interface IRatingRepository
{
    Task<Rating> AddAsync(Rating rating, CancellationToken ct = default);
    Task<IReadOnlyList<Rating>> GetByRatedUserIdAsync(Guid ratedUserId, CancellationToken ct = default);
    Task<double?> GetAverageScoreByRatedUserIdAsync(Guid ratedUserId, CancellationToken ct = default);
}
