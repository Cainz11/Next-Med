using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class UserDataCleanup : IUserDataCleanup
{
    private readonly AppDbContext _db;

    public UserDataCleanup(AppDbContext db) => _db = db;

    public async Task CleanupForUserAsync(Guid userId, CancellationToken ct = default)
    {
        await _db.RefreshTokens.Where(r => r.UserId == userId).ExecuteDeleteAsync(ct);
        await _db.ConsentLogs.Where(c => c.UserId == userId).ExecuteDeleteAsync(ct);
        await _db.AccessAudits.Where(a => a.UserId == userId).ExecuteDeleteAsync(ct);
        await _db.Ratings.Where(r => r.RaterUserId == userId || r.RatedUserId == userId).ExecuteDeleteAsync(ct);
    }
}
