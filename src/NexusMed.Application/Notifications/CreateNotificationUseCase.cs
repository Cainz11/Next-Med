using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.Notifications;

public class CreateNotificationUseCase
{
    private readonly INotificationRepository _notificationRepository;

    public CreateNotificationUseCase(INotificationRepository notificationRepository) => _notificationRepository = notificationRepository;

    public async Task<Guid> ExecuteAsync(Guid userId, string title, string? body, string type, string? relatedEntityId, string? relatedEntityType, CancellationToken ct = default)
    {
        var n = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = title,
            Body = body,
            Type = type,
            RelatedEntityId = relatedEntityId,
            RelatedEntityType = relatedEntityType,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };
        await _notificationRepository.AddAsync(n, ct);
        return n.Id;
    }
}
