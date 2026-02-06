using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class RefreshTokenStore : IRefreshTokenStore
{
    private readonly AppDbContext _db;

    public RefreshTokenStore(AppDbContext db) => _db = db;

    public async Task SaveAsync(Guid userId, string refreshToken, DateTime expiresAt, CancellationToken ct = default)
    {
        _db.RefreshTokens.Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Token = refreshToken,
            ExpiresAt = expiresAt
        });
        await _db.SaveChangesAsync(ct);
    }

    public async Task<Guid?> GetUserIdByRefreshTokenAsync(string refreshToken, CancellationToken ct = default)
    {
        var rt = await _db.RefreshTokens
            .FirstOrDefaultAsync(r => r.Token == refreshToken && r.ExpiresAt > DateTime.UtcNow, ct);
        return rt?.UserId;
    }

    public async Task RevokeAsync(string refreshToken, CancellationToken ct = default)
    {
        var rt = await _db.RefreshTokens.FirstOrDefaultAsync(r => r.Token == refreshToken, ct);
        if (rt != null)
        {
            _db.RefreshTokens.Remove(rt);
            await _db.SaveChangesAsync(ct);
        }
    }
}
