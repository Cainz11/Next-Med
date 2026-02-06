using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;
using NexusMed.Infrastructure.Persistence;

namespace NexusMed.Infrastructure.Repositories;

public class MessageRepository : IMessageRepository
{
    private readonly AppDbContext _db;

    public MessageRepository(AppDbContext db) => _db = db;

    public async Task<Message> AddAsync(Message message, CancellationToken ct = default)
    {
        _db.Messages.Add(message);
        await _db.SaveChangesAsync(ct);
        return message;
    }

    public async Task<IReadOnlyList<Message>> GetByConversationIdAsync(Guid conversationId, int skip, int take, CancellationToken ct = default) =>
        await _db.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.SentAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync(ct);

    public async Task MarkAsReadAsync(Guid conversationId, Guid exceptSenderUserId, CancellationToken ct = default)
    {
        await _db.Messages
            .Where(m => m.ConversationId == conversationId && m.SenderUserId != exceptSenderUserId)
            .ExecuteUpdateAsync(s => s.SetProperty(m => m.Read, true), ct);
    }
}
