namespace NexusMed.Domain.Entities;

public class ClinicalNote
{
    public Guid Id { get; set; }
    public Guid? AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }
    public Guid PatientId { get; set; }
    public PatientProfile Patient { get; set; } = null!;
    public Guid ProfessionalId { get; set; }
    public ProfessionalProfile Professional { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public string NoteType { get; set; } = "Evolution"; // Evolution | Anamnesis | Conduct
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
