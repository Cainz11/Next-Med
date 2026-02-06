using NexusMed.Domain.Entities;

namespace NexusMed.Domain.Ports;

public interface IMessageRepository
{
    Task<Message> AddAsync(Message message, CancellationToken ct = default);
    Task<IReadOnlyList<Message>> GetByConversationIdAsync(Guid conversationId, int skip, int take, CancellationToken ct = default);
    Task MarkAsReadAsync(Guid conversationId, Guid exceptSenderUserId, CancellationToken ct = default);
}
