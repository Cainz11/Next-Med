using Microsoft.EntityFrameworkCore;
using NexusMed.Domain.Entities;

namespace NexusMed.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<PatientProfile> PatientProfiles => Set<PatientProfile>();
    public DbSet<ProfessionalProfile> ProfessionalProfiles => Set<ProfessionalProfile>();
    public DbSet<Prescription> Prescriptions => Set<Prescription>();
    public DbSet<Exam> Exams => Set<Exam>();
    public DbSet<HealthMetric> HealthMetrics => Set<HealthMetric>();
    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Rating> Ratings => Set<Rating>();
    public DbSet<ConsentLog> ConsentLogs => Set<ConsentLog>();
    public DbSet<AccessAudit> AccessAudits => Set<AccessAudit>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<AvailabilitySlot> AvailabilitySlots => Set<AvailabilitySlot>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<ClinicalNote> ClinicalNotes => Set<ClinicalNote>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<PatientProfile>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ProfessionalProfile>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        // NoAction em ambos para evitar múltiplos cascade paths no SQL Server; exclusão na aplicação
        modelBuilder.Entity<Prescription>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Patient).WithMany().HasForeignKey(x => x.PatientId).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(x => x.Professional).WithMany().HasForeignKey(x => x.ProfessionalId).OnDelete(DeleteBehavior.NoAction);
        });

        // RequestedByProfessionalId: NoAction para evitar múltiplos cascade paths no SQL Server
        modelBuilder.Entity<Exam>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Patient).WithMany().HasForeignKey(x => x.PatientId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.RequestedByProfessional).WithMany().HasForeignKey(x => x.RequestedByProfessionalId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<HealthMetric>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Value).HasPrecision(18, 4);
            e.HasOne(x => x.Patient).WithMany().HasForeignKey(x => x.PatientId).OnDelete(DeleteBehavior.Cascade);
        });

        // SQL Server não permite múltiplos cascade paths; ON DELETE NO ACTION e exclusão em aplicação
        modelBuilder.Entity<Conversation>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Patient).WithMany().HasForeignKey(x => x.PatientId).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(x => x.Professional).WithMany().HasForeignKey(x => x.ProfessionalId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Message>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Conversation).WithMany(x => x.Messages).HasForeignKey(x => x.ConversationId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Rating>(e => e.HasKey(x => x.Id));
        modelBuilder.Entity<ConsentLog>(e => e.HasKey(x => x.Id));
        modelBuilder.Entity<AccessAudit>(e => e.HasKey(x => x.Id));
        modelBuilder.Entity<RefreshToken>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.Token);
        });

        modelBuilder.Entity<AvailabilitySlot>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Professional).WithMany().HasForeignKey(x => x.ProfessionalId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Appointment>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Patient).WithMany().HasForeignKey(x => x.PatientId).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(x => x.Professional).WithMany().HasForeignKey(x => x.ProfessionalId).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(x => x.Slot).WithMany().HasForeignKey(x => x.SlotId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<ClinicalNote>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Appointment).WithMany().HasForeignKey(x => x.AppointmentId).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(x => x.Patient).WithMany().HasForeignKey(x => x.PatientId).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(x => x.Professional).WithMany().HasForeignKey(x => x.ProfessionalId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Notification>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(x => new { x.UserId, x.IsRead, x.CreatedAt });
        });
    }
}
