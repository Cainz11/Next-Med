using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class AccessAuditRepository : IAccessAuditRepository
{
    private readonly AppDbContext _db;

    public AccessAuditRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(AccessAudit audit, CancellationToken ct = default)
    {
        _db.AccessAudits.Add(audit);
        await _db.SaveChangesAsync(ct);
    }
}
