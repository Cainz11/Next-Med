using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusMed.Application.Lgpd;

namespace NexusMed.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LgpdController : ControllerBase
{
    /// <summary>
    /// Retorna o status do último consentimento para a finalidade informada.
    /// accepted: true = já aceitou, false = recusou, null = nunca registrou.
    /// </summary>
    [HttpGet("consent-status")]
    public async Task<IActionResult> GetConsentStatus([FromQuery] string? purpose, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var purposeValue = string.IsNullOrWhiteSpace(purpose) ? "Uso de dados de saúde no app Nexus Med" : purpose;
        var useCase = HttpContext.RequestServices.GetRequiredService<GetConsentStatusUseCase>();
        var result = await useCase.ExecuteAsync(userId, purposeValue, ct);
        return Ok(new { accepted = result.Accepted, recordedAt = result.RecordedAt });
    }

    [HttpPost("consent")]
    public async Task<IActionResult> RecordConsent([FromBody] RecordConsentRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var command = new RecordConsentCommand(request.Purpose, request.Accepted);
        var useCase = HttpContext.RequestServices.GetRequiredService<RecordConsentUseCase>();
        await useCase.ExecuteAsync(command, userId, HttpContext.Connection.RemoteIpAddress?.ToString(), ct);
        return NoContent();
    }

    [HttpGet("export-my-data")]
    public async Task<IActionResult> ExportMyData(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<ExportMyDataUseCase>();
        var result = await useCase.ExecuteAsync(userId, ct);
        return Ok(result);
    }

    [HttpDelete("my-account")]
    public async Task<IActionResult> DeleteMyAccount(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<DeleteMyAccountUseCase>();
        await useCase.ExecuteAsync(userId, ct);
        return NoContent();
    }
}

public record RecordConsentRequest(string Purpose, bool Accepted);
