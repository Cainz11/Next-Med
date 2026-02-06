using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.Ratings;

public record ProfessionalRatingDto(Guid UserId, double AverageScore, int TotalRatings, IReadOnlyList<RatingSummary> RecentRatings);

public record RatingSummary(int Score, string? Comment, DateTime CreatedAt);

public class GetProfessionalRatingsUseCase
{
    private readonly IRatingRepository _ratingRepository;
    private readonly IProfessionalProfileRepository _professionalProfileRepository;

    public GetProfessionalRatingsUseCase(
        IRatingRepository ratingRepository,
        IProfessionalProfileRepository professionalProfileRepository)
    {
        _ratingRepository = ratingRepository;
        _professionalProfileRepository = professionalProfileRepository;
    }

    public async Task<ProfessionalRatingDto?> ExecuteAsync(Guid professionalUserId, int recentCount = 10, CancellationToken ct = default)
    {
        var professional = await _professionalProfileRepository.GetByUserIdAsync(professionalUserId, ct);
        if (professional == null) return null;

        var average = await _ratingRepository.GetAverageScoreByRatedUserIdAsync(professionalUserId, ct);
        var all = await _ratingRepository.GetByRatedUserIdAsync(professionalUserId, ct);
        var recent = all.Take(recentCount).Select(r => new RatingSummary(r.Score, r.Comment, r.CreatedAt)).ToList();

        return new ProfessionalRatingDto(
            professionalUserId,
            average ?? 0,
            all.Count,
            recent
        );
    }
}
