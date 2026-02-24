namespace NexusMed.Domain.Entities;

public class AvailabilitySlot
{
    public Guid Id { get; set; }
    public Guid ProfessionalId { get; set; }
    public ProfessionalProfile Professional { get; set; } = null!;
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public string SlotType { get; set; } = "Presencial"; // Presencial | Telemedicina
    public DateTime CreatedAt { get; set; }
}
