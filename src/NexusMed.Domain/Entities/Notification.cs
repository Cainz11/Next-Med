namespace NexusMed.Domain.Entities;

public class Notification
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string? Body { get; set; }
    public string Type { get; set; } = string.Empty; // AppointmentScheduled, AppointmentReminder, AppointmentCancelled, NewMessage, etc.
    public string? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; } // Appointment, Message, Conversation
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
