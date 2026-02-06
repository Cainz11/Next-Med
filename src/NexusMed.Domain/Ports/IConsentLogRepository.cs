using NexusMed.Domain.Entities;

namespace NexusMed.Domain.Ports;

public interface IConsentLogRepository
{
    Task AddAsync(ConsentLog log, CancellationToken ct = default);
}
