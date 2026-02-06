namespace NexusMed.Domain.Entities;

public class Conversation
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public PatientProfile Patient { get; set; } = null!;
    public Guid ProfessionalId { get; set; }
    public ProfessionalProfile Professional { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
