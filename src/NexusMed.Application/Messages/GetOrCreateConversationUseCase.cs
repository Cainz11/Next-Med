using NexusMed.Domain.Ports;

namespace NexusMed.Application.Messages;

public class GetOrCreateConversationUseCase
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public GetOrCreateConversationUseCase(
        IConversationRepository conversationRepository,
        IPatientProfileRepository patientProfileRepository,
        IProfessionalProfileRepository professionalProfileRepository)
    {
        _conversationRepository = conversationRepository;
        _patientProfileRepository = patientProfileRepository;
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task<Domain.Entities.Conversation> ExecuteAsync(Guid patientUserId, Guid professionalId, CancellationToken ct = default)
    {
        var patient = await _patientProfileRepository.GetByUserIdAsync(patientUserId, ct)
            ?? throw new InvalidOperationException("Perfil de paciente não encontrado.");
        _ = await _professionalProfileRepository.GetByIdAsync(professionalId, ct)
            ?? throw new InvalidOperationException("Profissional não encontrado.");

        return await _conversationRepository.GetOrCreateBetweenAsync(patient.Id, professionalId, ct)
            ?? throw new InvalidOperationException("Não foi possível obter ou criar a conversa.");
    }
}
