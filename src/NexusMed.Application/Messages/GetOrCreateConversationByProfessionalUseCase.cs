using NexusMed.Domain.Ports;

namespace NexusMed.Application.Messages;

public class GetOrCreateConversationByProfessionalUseCase
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public GetOrCreateConversationByProfessionalUseCase(
        IConversationRepository conversationRepository,
        IPatientProfileRepository patientProfileRepository,
        IProfessionalProfileRepository professionalProfileRepository)
    {
        _conversationRepository = conversationRepository;
        _patientProfileRepository = patientProfileRepository;
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task<Domain.Entities.Conversation> ExecuteAsync(Guid professionalUserId, Guid patientProfileId, CancellationToken ct = default)
    {
        var professional = await _professionalProfileRepository.GetByUserIdAsync(professionalUserId, ct)
            ?? throw new InvalidOperationException("Perfil profissional não encontrado.");
        var patient = await _patientProfileRepository.GetByIdAsync(patientProfileId, ct)
            ?? throw new InvalidOperationException("Paciente não encontrado.");

        return await _conversationRepository.GetOrCreateBetweenAsync(patient.Id, professional.Id, ct)
            ?? throw new InvalidOperationException("Não foi possível obter ou criar a conversa.");
    }
}
