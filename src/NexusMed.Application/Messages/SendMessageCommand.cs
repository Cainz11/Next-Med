namespace NexusMed.Application.Messages;

public record SendMessageCommand(Guid ConversationId, string Content);
