using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class ConsentLogRepository : IConsentLogRepository
{
    private readonly AppDbContext _db;

    public ConsentLogRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(ConsentLog log, CancellationToken ct = default)
    {
        _db.ConsentLogs.Add(log);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<ConsentLog?> GetLastByUserAndPurposeAsync(Guid userId, string purpose, CancellationToken ct = default)
    {
        return await _db.ConsentLogs
            .Where(c => c.UserId == userId && c.Purpose == purpose)
            .OrderByDescending(c => c.RecordedAt)
            .FirstOrDefaultAsync(ct);
    }
}
