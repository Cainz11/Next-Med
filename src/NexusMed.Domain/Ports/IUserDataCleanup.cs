namespace NexusMed.Domain.Ports;

public interface IUserDataCleanup
{
    Task CleanupForUserAsync(Guid userId, CancellationToken ct = default);
}
