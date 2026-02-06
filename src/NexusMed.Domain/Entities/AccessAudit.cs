namespace NexusMed.Domain.Entities;

public class AccessAudit
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string ResourceType { get; set; } = string.Empty; // Prescription, Exam, HealthMetric, etc.
    public Guid ResourceId { get; set; }
    public string Action { get; set; } = string.Empty; // Read, Create, Update, Delete
    public DateTime OccurredAt { get; set; }
    public string? IpAddress { get; set; }
}
