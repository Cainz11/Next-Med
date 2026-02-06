using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.Messages;

public class SendMessageUseCase
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;

    public SendMessageUseCase(
        IConversationRepository conversationRepository,
        IMessageRepository messageRepository)
    {
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
    }

    public async Task<Guid> ExecuteAsync(SendMessageCommand command, Guid senderUserId, CancellationToken ct = default)
    {
        var conversation = await _conversationRepository.GetByIdAsync(command.ConversationId, ct)
            ?? throw new InvalidOperationException("Conversa não encontrada.");

        if (conversation.Patient.UserId != senderUserId && conversation.Professional.UserId != senderUserId)
            throw new UnauthorizedAccessException("Você não faz parte desta conversa.");

        var message = new Message
        {
            Id = Guid.NewGuid(),
            ConversationId = command.ConversationId,
            SenderUserId = senderUserId,
            Content = command.Content,
            SentAt = DateTime.UtcNow,
            Read = false
        };
        await _messageRepository.AddAsync(message, ct);

        conversation.LastMessageAt = DateTime.UtcNow;
        await _conversationRepository.UpdateAsync(conversation, ct);

        await _messageRepository.MarkAsReadAsync(command.ConversationId, senderUserId, ct);

        return message.Id;
    }
}
