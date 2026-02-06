namespace NexusMed.Application.Ratings;

public record CreateRatingCommand(Guid RatedUserId, string? Context, int Score, string? Comment);
