using NexusMed.Domain.Entities;

namespace NexusMed.Domain.Ports;

public interface IAccessAuditRepository
{
    Task AddAsync(AccessAudit audit, CancellationToken ct = default);
}
