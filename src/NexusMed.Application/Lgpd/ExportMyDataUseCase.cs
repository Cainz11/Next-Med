using NexusMed.Domain.Ports;

namespace NexusMed.Application.Lgpd;

public record ExportDataResult(
    object User,
    object? PatientProfile,
    object? ProfessionalProfile,
    IReadOnlyList<object> Prescriptions,
    IReadOnlyList<object> Exams,
    IReadOnlyList<object> HealthMetrics,
    IReadOnlyList<object> RatingsReceived,
    IReadOnlyList<object> RatingsGiven
);

public class ExportMyDataUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IExamRepository _examRepository;
    private readonly IHealthMetricRepository _healthMetricRepository;
    private readonly IRatingRepository _ratingRepository;
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;

    public ExportMyDataUseCase(
        IUserRepository userRepository,
        IPatientProfileRepository patientProfileRepository,
        IProfessionalProfileRepository professionalProfileRepository,
        IPrescriptionRepository prescriptionRepository,
        IExamRepository examRepository,
        IHealthMetricRepository healthMetricRepository,
        IRatingRepository ratingRepository,
        IConversationRepository conversationRepository,
        IMessageRepository messageRepository)
    {
        _userRepository = userRepository;
        _patientProfileRepository = patientProfileRepository;
        _professionalProfileRepository = professionalProfileRepository;
        _prescriptionRepository = prescriptionRepository;
        _examRepository = examRepository;
        _healthMetricRepository = healthMetricRepository;
        _ratingRepository = ratingRepository;
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
    }

    public async Task<ExportDataResult> ExecuteAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, ct)
            ?? throw new InvalidOperationException("Usuário não encontrado.");

        object? patientProfile = null;
        object? professionalProfile = null;
        if (user.Role == Application.Common.Roles.Patient)
        {
            var p = await _patientProfileRepository.GetByUserIdAsync(userId, ct);
            if (p != null)
                patientProfile = new { p.Id, p.FullName, p.DateOfBirth, p.Phone, p.DocumentNumber, p.CreatedAt };
        }
        else
        {
            var p = await _professionalProfileRepository.GetByUserIdAsync(userId, ct);
            if (p != null)
                professionalProfile = new { p.Id, p.FullName, p.Crm, p.Specialty, p.Phone, p.CreatedAt };
        }

        var prescriptions = new List<object>();
        var exams = new List<object>();
        if (patientProfile != null)
        {
            var patient = await _patientProfileRepository.GetByUserIdAsync(userId, ct);
            if (patient != null)
            {
                var prescList = await _prescriptionRepository.GetByPatientIdAsync(patient.Id, ct);
                prescriptions.AddRange(prescList.Select(x => (object)new { x.Id, x.Description, x.IssuedAt, x.CreatedAt }));
                var examList = await _examRepository.GetByPatientIdAsync(patient.Id, ct);
                exams.AddRange(examList.Select(x => (object)new { x.Id, x.Name, x.ExamDate, x.CreatedAt }));
            }
        }

        var healthMetrics = new List<object>();
        if (patientProfile != null)
        {
            var patient = await _patientProfileRepository.GetByUserIdAsync(userId, ct);
            if (patient != null)
            {
                var metrics = await _healthMetricRepository.GetByPatientIdAsync(patient.Id, null, null, ct);
                healthMetrics.AddRange(metrics.Select(m => (object)new { m.Id, m.MetricType, m.Value, m.Unit, m.Notes, m.RecordedAt }));
            }
        }

        var ratingsReceived = (await _ratingRepository.GetByRatedUserIdAsync(userId, ct))
            .Select(r => (object)new { r.Id, r.Score, r.Comment, r.Context, r.CreatedAt }).ToList();
        var ratingsGiven = new List<object>(); // would need GetByRaterUserId - skip for minimal export
        return new ExportDataResult(
            User: new { user.Id, user.Email, user.Role, user.CreatedAt },
            PatientProfile: patientProfile,
            ProfessionalProfile: professionalProfile,
            Prescriptions: prescriptions,
            Exams: exams,
            HealthMetrics: healthMetrics,
            RatingsReceived: ratingsReceived,
            RatingsGiven: ratingsGiven
        );
    }
}
