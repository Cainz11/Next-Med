using NexusMed.Domain.Ports;

namespace NexusMed.Application.Notifications;

public class GetMyNotificationsUseCase
{
    private readonly INotificationRepository _notificationRepository;

    public GetMyNotificationsUseCase(INotificationRepository notificationRepository) => _notificationRepository = notificationRepository;

    public async Task<(IReadOnlyList<NotificationDto> Items, int UnreadCount)> ExecuteAsync(Guid userId, bool unreadOnly, int skip, int take, CancellationToken ct = default)
    {
        var items = await _notificationRepository.GetByUserIdAsync(userId, unreadOnly, skip, take, ct);
        var unreadCount = await _notificationRepository.GetUnreadCountAsync(userId, ct);
        return (items.Select(n => new NotificationDto(n.Id, n.UserId, n.Title, n.Body, n.Type, n.RelatedEntityId, n.RelatedEntityType, n.IsRead, n.ReadAt, n.CreatedAt)).ToList(), unreadCount);
    }
}

public record NotificationDto(Guid Id, Guid UserId, string Title, string? Body, string Type, string? RelatedEntityId, string? RelatedEntityType, bool IsRead, DateTime? ReadAt, DateTime CreatedAt);
