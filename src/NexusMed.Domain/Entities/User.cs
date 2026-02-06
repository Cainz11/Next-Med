namespace NexusMed.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // "Patient" | "Professional"
    public DateTime CreatedAt { get; set; }
    public bool EmailConfirmed { get; set; }
}
