namespace NexusMed.Application.Profile;

public record UpdateProfessionalProfileCommand(
    string FullName,
    string? Crm,
    string? Specialty,
    string? Phone
);
