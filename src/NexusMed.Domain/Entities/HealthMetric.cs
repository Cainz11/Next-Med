namespace NexusMed.Domain.Entities;

public class HealthMetric
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public PatientProfile Patient { get; set; } = null!;
    public string MetricType { get; set; } = string.Empty; // Glicemia, PA, Peso, AtividadeFisica, etc.
    public decimal? Value { get; set; }
    public string? Unit { get; set; }
    public string? Notes { get; set; }
    public DateTime RecordedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
