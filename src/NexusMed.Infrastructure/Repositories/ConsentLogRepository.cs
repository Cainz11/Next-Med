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
}
