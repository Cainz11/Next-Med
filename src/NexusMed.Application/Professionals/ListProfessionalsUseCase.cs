using NexusMed.Domain.Ports;

namespace NexusMed.Application.Professionals;

public class ListProfessionalsUseCase
{
    private readonly IProfessionalProfileRepository _professionalProfileRepository;
    private readonly IRatingRepository _ratingRepository;

    public ListProfessionalsUseCase(
        IProfessionalProfileRepository professionalProfileRepository,
        IRatingRepository ratingRepository)
    {
        _professionalProfileRepository = professionalProfileRepository;
        _ratingRepository = ratingRepository;
    }

    public async Task<IReadOnlyList<ProfessionalListItemDto>> ExecuteAsync(int skip, int take, CancellationToken ct = default)
    {
        var professionals = await _professionalProfileRepository.ListAsync(skip, take, ct);
        var result = new List<ProfessionalListItemDto>();

        foreach (var p in professionals)
        {
            var avg = await _ratingRepository.GetAverageScoreByRatedUserIdAsync(p.UserId, ct);
            result.Add(new ProfessionalListItemDto(
                p.Id,
                p.UserId,
                p.FullName,
                p.Crm,
                p.Specialty,
                p.Phone,
                (double)(avg ?? 0)
            ));
        }

        return result;
    }
}

public record ProfessionalListItemDto(Guid Id, Guid UserId, string FullName, string? Crm, string? Specialty, string? Phone, double AverageRating);
