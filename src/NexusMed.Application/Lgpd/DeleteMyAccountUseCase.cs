using NexusMed.Domain.Ports;

namespace NexusMed.Application.Lgpd;

public class DeleteMyAccountUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;
    private readonly IConversationRepository _conversationRepository;
    private readonly IExamRepository _examRepository;
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IUserDataCleanup _userDataCleanup;

    public DeleteMyAccountUseCase(
        IUserRepository userRepository,
        IPatientProfileRepository patientProfileRepository,
        IProfessionalProfileRepository professionalProfileRepository,
        IConversationRepository conversationRepository,
        IExamRepository examRepository,
        IPrescriptionRepository prescriptionRepository,
        IUserDataCleanup userDataCleanup)
    {
        _userRepository = userRepository;
        _patientProfileRepository = patientProfileRepository;
        _professionalProfileRepository = professionalProfileRepository;
        _conversationRepository = conversationRepository;
        _examRepository = examRepository;
        _prescriptionRepository = prescriptionRepository;
        _userDataCleanup = userDataCleanup;
    }

    public async Task ExecuteAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, ct)
            ?? throw new InvalidOperationException("Usuário não encontrado.");

        await _userDataCleanup.CleanupForUserAsync(userId, ct);

        if (user.Role == Application.Common.Roles.Patient)
        {
            var profile = await _patientProfileRepository.GetByUserIdAsync(userId, ct);
            if (profile != null)
            {
                await _prescriptionRepository.DeleteByPatientIdAsync(profile.Id, ct);
                await _conversationRepository.DeleteByPatientIdAsync(profile.Id, ct);
                await _patientProfileRepository.DeleteAsync(profile, ct);
            }
        }
        else
        {
            var profile = await _professionalProfileRepository.GetByUserIdAsync(userId, ct);
            if (profile != null)
            {
                await _prescriptionRepository.DeleteByProfessionalIdAsync(profile.Id, ct);
                await _examRepository.ClearRequestedByProfessionalAsync(profile.Id, ct);
                await _conversationRepository.DeleteByProfessionalIdAsync(profile.Id, ct);
                await _professionalProfileRepository.DeleteAsync(profile, ct);
            }
        }

        await _userRepository.DeleteAsync(user, ct);
    }
}
