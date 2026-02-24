using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusMed.Application.AvailabilitySlots;

namespace NexusMed.WebApi.Controllers;

[ApiController]
[Route("api/availability-slots")]
[Authorize]
public class AvailabilitySlotsController : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "Professional")]
    public async Task<IActionResult> Create([FromBody] CreateAvailabilitySlotsRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<CreateAvailabilitySlotsUseCase>();
        var command = new CreateAvailabilitySlotsCommand(request.Slots.Select(s => new SlotItem(s.StartAt, s.EndAt, s.SlotType)).ToList());
        var ids = await useCase.ExecuteAsync(command, userId, ct);
        return Ok(new { ids });
    }

    [HttpGet]
    [Authorize(Roles = "Professional")]
    public async Task<IActionResult> GetMy([FromQuery] DateTime from, [FromQuery] DateTime to, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<GetMyAvailabilitySlotsUseCase>();
        var list = await useCase.ExecuteAsync(userId, from, to, ct);
        return Ok(list);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Professional")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var useCase = HttpContext.RequestServices.GetRequiredService<DeleteAvailabilitySlotUseCase>();
        await useCase.ExecuteAsync(id, userId, ct);
        return NoContent();
    }
}

public record CreateAvailabilitySlotsRequest(IEnumerable<SlotRequestItem> Slots);
public record SlotRequestItem(DateTime StartAt, DateTime EndAt, string? SlotType);
