namespace NexusMed.Domain.Ports;

public interface IRefreshTokenStore
{
    Task SaveAsync(Guid userId, string refreshToken, DateTime expiresAt, CancellationToken ct = default);
    Task<Guid?> GetUserIdByRefreshTokenAsync(string refreshToken, CancellationToken ct = default);
    Task RevokeAsync(string refreshToken, CancellationToken ct = default);
}
