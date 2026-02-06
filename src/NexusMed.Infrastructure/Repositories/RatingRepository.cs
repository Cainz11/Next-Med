using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class RatingRepository : IRatingRepository
{
    private readonly AppDbContext _db;

    public RatingRepository(AppDbContext db) => _db = db;

    public async Task<Rating> AddAsync(Rating rating, CancellationToken ct = default)
    {
        _db.Ratings.Add(rating);
        await _db.SaveChangesAsync(ct);
        return rating;
    }

    public async Task<IReadOnlyList<Rating>> GetByRatedUserIdAsync(Guid ratedUserId, CancellationToken ct = default) =>
        await _db.Ratings.Where(r => r.RatedUserId == ratedUserId).OrderByDescending(r => r.CreatedAt).ToListAsync(ct);

    public async Task<double?> GetAverageScoreByRatedUserIdAsync(Guid ratedUserId, CancellationToken ct = default) =>
        await _db.Ratings.Where(r => r.RatedUserId == ratedUserId).AverageAsync(r => (double?)r.Score, ct);
}
