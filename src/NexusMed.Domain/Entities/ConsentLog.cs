namespace NexusMed.Domain.Entities;

public class ConsentLog
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Purpose { get; set; } = string.Empty;
    public bool Accepted { get; set; }
    public DateTime RecordedAt { get; set; }
    public string? IpAddress { get; set; }
}
