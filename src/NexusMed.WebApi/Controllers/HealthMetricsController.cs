using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusMed.Application.HealthMetrics;
using NexusMed.Domain;

namespace NexusMed.WebApi.Controllers;

[ApiController]
[Route("api/health-metrics")]
[Authorize]
public class HealthMetricsController : ControllerBase
{
    /// <summary>
    /// Lista de unidades permitidas para o dropdown de métricas de saúde.
    /// </summary>
    [HttpGet("units")]
    public IActionResult GetUnits()
    {
        var list = HealthMetricUnitExtensions.GetAllUnitsForDropdown();
        return Ok(list.Select(x => new { value = x.Value, label = x.Label }));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateHealthMetricRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var command = new CreateHealthMetricCommand(request.MetricType, request.Value, request.Unit, request.Notes, request.RecordedAt);
        var useCase = HttpContext.RequestServices.GetRequiredService<CreateHealthMetricUseCase>();
        var id = await useCase.ExecuteAsync(command, userId, HttpContext.Connection.RemoteIpAddress?.ToString(), ct);
        return CreatedAtAction(nameof(GetAll), null, new { id });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? patientId, [FromQuery] DateTime? from, [FromQuery] DateTime? to, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var useCase = HttpContext.RequestServices.GetRequiredService<GetHealthMetricsUseCase>();
        var list = await useCase.ExecuteAsync(userId, role, patientId, from, to, HttpContext.Connection.RemoteIpAddress?.ToString(), ct);
        return Ok(list.Select(m => new { m.Id, m.MetricType, m.Value, m.Unit, m.Notes, m.RecordedAt, m.CreatedAt }));
    }
}

public record CreateHealthMetricRequest(string MetricType, decimal? Value, string? Unit, string? Notes, DateTime RecordedAt);
