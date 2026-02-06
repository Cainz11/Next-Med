namespace NexusMed.Application.Exams;

public record CreateExamCommand(
    Guid PatientId,
    string? Name,
    string? FilePath,
    DateTime? ExamDate,
    Guid? RequestedByProfessionalId
);
