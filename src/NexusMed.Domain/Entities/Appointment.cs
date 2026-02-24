namespace NexusMed.Domain.Entities;

public class Appointment
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public PatientProfile Patient { get; set; } = null!;
    public Guid ProfessionalId { get; set; }
    public ProfessionalProfile Professional { get; set; } = null!;
    public Guid? SlotId { get; set; }
    public AvailabilitySlot? Slot { get; set; }
    public DateTime ScheduledAt { get; set; }
    public int DurationMinutes { get; set; } = 30;
    public string Status { get; set; } = "Scheduled"; // Scheduled | Completed | Cancelled | NoShow
    public string AppointmentType { get; set; } = "Presencial";
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }
}
