namespace NexusMed.Application.Prescriptions;

public record CreatePrescriptionCommand(
    Guid PatientId,
    string? Description,
    string? FilePath
);
