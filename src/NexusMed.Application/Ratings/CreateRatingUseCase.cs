using NexusMed.Domain.Entities;
using NexusMed.Domain.Ports;

namespace NexusMed.Application.Ratings;

public class CreateRatingUseCase
{
    private readonly IRatingRepository _ratingRepository;
    private readonly IUserRepository _userRepository;

    public CreateRatingUseCase(IRatingRepository ratingRepository, IUserRepository userRepository)
    {
        _ratingRepository = ratingRepository;
        _userRepository = userRepository;
    }

    public async Task<Guid> ExecuteAsync(CreateRatingCommand command, Guid raterUserId, CancellationToken ct = default)
    {
        if (command.Score < 1 || command.Score > 5)
            throw new ArgumentException("A nota deve ser entre 1 e 5.");

        _ = await _userRepository.GetByIdAsync(command.RatedUserId, ct)
            ?? throw new InvalidOperationException("Usuário avaliado não encontrado.");

        var rating = new Rating
        {
            Id = Guid.NewGuid(),
            RaterUserId = raterUserId,
            RatedUserId = command.RatedUserId,
            Context = command.Context,
            Score = command.Score,
            Comment = command.Comment,
            CreatedAt = DateTime.UtcNow
        };
        await _ratingRepository.AddAsync(rating, ct);
        return rating.Id;
    }
}
