namespace NexusMed.Domain.Entities;

public class Exam
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public PatientProfile Patient { get; set; } = null!;
    public Guid? RequestedByProfessionalId { get; set; }
    public ProfessionalProfile? RequestedByProfessional { get; set; }
    public string? Name { get; set; }
    public string? FilePath { get; set; }
    public DateTime? ExamDate { get; set; }
    public DateTime CreatedAt { get; set; }
}
