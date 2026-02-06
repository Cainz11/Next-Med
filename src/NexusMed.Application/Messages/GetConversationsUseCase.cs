using NexusMed.Domain.Ports;

namespace NexusMed.Application.Messages;

public class GetConversationsUseCase
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IPatientProfileRepository _patientProfileRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public GetConversationsUseCase(
        IConversationRepository conversationRepository,
        IPatientProfileRepository patientProfileRepository,
        IProfessionalProfileRepository professionalProfileRepository)
    {
        _conversationRepository = conversationRepository;
        _patientProfileRepository = patientProfileRepository;
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task<IReadOnlyList<Domain.Entities.Conversation>> ExecuteAsync(Guid userId, string role, CancellationToken ct = default)
    {
        if (role == Application.Common.Roles.Patient)
        {
            var patient = await _patientProfileRepository.GetByUserIdAsync(userId, ct)
                ?? throw new InvalidOperationException("Perfil de paciente não encontrado.");
            return await _conversationRepository.GetByPatientIdAsync(patient.Id, ct);
        }

        var professional = await _professionalProfileRepository.GetByUserIdAsync(userId, ct)
            ?? throw new InvalidOperationException("Perfil profissional não encontrado.");
        return await _conversationRepository.GetByProfessionalIdAsync(professional.Id, ct);
    }
}
