namespace NexusMed.Application.Auth;

public record RegisterPatientCommand(
    string Email,
    string Password,
    string FullName,
    DateTime? DateOfBirth,
    string? Phone,
    string? DocumentNumber
);
