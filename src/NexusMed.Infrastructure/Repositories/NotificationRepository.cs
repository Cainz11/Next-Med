using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly AppDbContext _db;

    public NotificationRepository(AppDbContext db) => _db = db;

    public async Task<Notification?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.Notifications.FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<IReadOnlyList<Notification>> GetByUserIdAsync(Guid userId, bool unreadOnly, int skip, int take, CancellationToken ct = default)
    {
        var q = _db.Notifications.Where(x => x.UserId == userId);
        if (unreadOnly) q = q.Where(x => !x.IsRead);
        return await q.OrderByDescending(x => x.CreatedAt).Skip(skip).Take(take).ToListAsync(ct);
    }

    public async Task<int> GetUnreadCountAsync(Guid userId, CancellationToken ct = default) =>
        await _db.Notifications.CountAsync(x => x.UserId == userId && !x.IsRead, ct);

    public async Task<Notification> AddAsync(Notification notification, CancellationToken ct = default)
    {
        _db.Notifications.Add(notification);
        await _db.SaveChangesAsync(ct);
        return notification;
    }

    public async Task UpdateAsync(Notification notification, CancellationToken ct = default)
    {
        _db.Notifications.Update(notification);
        await _db.SaveChangesAsync(ct);
    }

    public async Task MarkAllAsReadAsync(Guid userId, CancellationToken ct = default)
    {
        await _db.Notifications
            .Where(x => x.UserId == userId && !x.IsRead)
            .ExecuteUpdateAsync(s => s
                .SetProperty(n => n.IsRead, true)
                .SetProperty(n => n.ReadAt, DateTime.UtcNow), ct);
    }
}
