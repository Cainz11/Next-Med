using NexusMed.Domain.Ports;

namespace NexusMed.Application.Messages;

public class GetMessagesUseCase
{
    private readonly IMessageRepository _messageRepository;
    private readonly IConversationRepository _conversationRepository;

    public GetMessagesUseCase(
        IMessageRepository messageRepository,
        IConversationRepository conversationRepository)
    {
        _messageRepository = messageRepository;
        _conversationRepository = conversationRepository;
    }

    public async Task<IReadOnlyList<Domain.Entities.Message>> ExecuteAsync(Guid conversationId, Guid userId, int skip, int take, CancellationToken ct = default)
    {
        var conversation = await _conversationRepository.GetByIdAsync(conversationId, ct)
            ?? throw new InvalidOperationException("Conversa não encontrada.");

        if (conversation.Patient.UserId != userId && conversation.Professional.UserId != userId)
            throw new UnauthorizedAccessException("Você não faz parte desta conversa.");

        return await _messageRepository.GetByConversationIdAsync(conversationId, skip, take, ct);
    }
}
