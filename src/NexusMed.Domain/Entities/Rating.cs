namespace NexusMed.Domain.Entities;

public class Rating
{
    public Guid Id { get; set; }
    public Guid RaterUserId { get; set; }
    public Guid RatedUserId { get; set; }
    public string? Context { get; set; } // ex: consulta, atendimento
    public int Score { get; set; } // 1-5
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}
