namespace NexusMed.Domain.Entities;

public class Prescription
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public PatientProfile Patient { get; set; } = null!;
    public Guid ProfessionalId { get; set; }
    public ProfessionalProfile Professional { get; set; } = null!;
    public string? Description { get; set; }
    public string? FilePath { get; set; }
    public DateTime IssuedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
