namespace NexusMed.Application.Profile;

public record UpdatePatientProfileCommand(
    string FullName,
    DateTime? DateOfBirth,
    string? Phone,
    string? DocumentNumber
);
