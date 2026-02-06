namespace NexusMed.Application.HealthMetrics;

public record CreateHealthMetricCommand(
    string MetricType,
    decimal? Value,
    string? Unit,
    string? Notes,
    DateTime RecordedAt
);
