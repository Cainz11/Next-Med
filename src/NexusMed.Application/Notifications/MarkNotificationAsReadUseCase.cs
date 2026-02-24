using NexusMed.Domain.Ports;

namespace NexusMed.Application.Notifications;

public class MarkNotificationAsReadUseCase
{
    private readonly INotificationRepository _notificationRepository;

    public MarkNotificationAsReadUseCase(INotificationRepository notificationRepository) => _notificationRepository = notificationRepository;

    public async Task ExecuteAsync(Guid notificationId, Guid userId, CancellationToken ct = default)
    {
        var n = await _notificationRepository.GetByIdAsync(notificationId, ct)
            ?? throw new InvalidOperationException("Notificação não encontrada.");
        if (n.UserId != userId)
            throw new UnauthorizedAccessException("Notificação não pertence ao usuário.");
        if (n.IsRead) return;
        n.IsRead = true;
        n.ReadAt = DateTime.UtcNow;
        await _notificationRepository.UpdateAsync(n, ct);
    }
}
