namespace NexusMed.Application.Auth;

public record RegisterProfessionalCommand(
    string Email,
    string Password,
    string FullName,
    string? Crm,
    string? Specialty,
    string? Phone
);
