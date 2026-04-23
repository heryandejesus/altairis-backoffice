using Altairis.Api.Data;
using Altairis.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Altairis.Api.Controllers;

[ApiController]
[Route("api/availability")]
public class AvailabilityController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<object>>> Get(
        [FromQuery] int? hotelId,
        [FromQuery] string? date)
    {
        var query = db.Availabilities
            .Include(a => a.RoomType)
            .Include(a => a.Hotel)
            .AsQueryable();

        if (hotelId.HasValue)
            query = query.Where(a => a.HotelId == hotelId.Value);

        if (!string.IsNullOrWhiteSpace(date) && DateOnly.TryParse(date, out var parsedDate))
            query = query.Where(a => a.Date == parsedDate);

        var result = await query
            .OrderBy(a => a.Date)
            .ThenBy(a => a.HotelId)
            .Select(a => new
            {
                a.Id,
                a.HotelId,
                HotelName = a.Hotel.Name,
                a.RoomTypeId,
                RoomTypeName = a.RoomType.Name,
                Date = a.Date.ToString("yyyy-MM-dd"),
                a.AvailableRooms,
                a.Price
            })
            .ToListAsync();

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Availability>> Create(Availability availability)
    {
        var existing = await db.Availabilities.FirstOrDefaultAsync(a =>
            a.HotelId == availability.HotelId &&
            a.RoomTypeId == availability.RoomTypeId &&
            a.Date == availability.Date);

        if (existing is not null)
        {
            existing.AvailableRooms = availability.AvailableRooms;
            existing.Price = availability.Price;
            await db.SaveChangesAsync();
            return Ok(existing);
        }

        db.Availabilities.Add(availability);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), null, availability);
    }
}
