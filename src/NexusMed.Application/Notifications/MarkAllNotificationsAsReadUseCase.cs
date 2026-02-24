using NexusMed.Domain.Ports;

namespace NexusMed.Application.Notifications;

public class MarkAllNotificationsAsReadUseCase
{
    private readonly INotificationRepository _notificationRepository;

    public MarkAllNotificationsAsReadUseCase(INotificationRepository notificationRepository) => _notificationRepository = notificationRepository;

    public async Task ExecuteAsync(Guid userId, CancellationToken ct = default) =>
        await _notificationRepository.MarkAllAsReadAsync(userId, ct);
}
