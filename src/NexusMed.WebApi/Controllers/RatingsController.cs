using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusMed.Application.Ratings;

namespace NexusMed.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RatingsController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRatingRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var command = new CreateRatingCommand(request.RatedUserId, request.Context, request.Score, request.Comment);
        var useCase = HttpContext.RequestServices.GetRequiredService<CreateRatingUseCase>();
        try
        {
            var id = await useCase.ExecuteAsync(command, userId, ct);
            return Ok(new { id });
        }
        catch (ArgumentException e)
        {
            return BadRequest(new { message = e.Message });
        }
    }

    [HttpGet("professional/{professionalUserId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProfessionalRatings(Guid professionalUserId, [FromQuery] int recentCount = 10, CancellationToken ct = default)
    {
        var useCase = HttpContext.RequestServices.GetRequiredService<GetProfessionalRatingsUseCase>();
        var result = await useCase.ExecuteAsync(professionalUserId, recentCount, ct);
        if (result == null) return NotFound();
        return Ok(result);
    }
}

public record CreateRatingRequest(Guid RatedUserId, string? Context, int Score, string? Comment);
