using Altairis.Api.Data;
using Altairis.Api.DTOs;
using Altairis.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Altairis.Api.Controllers;

[ApiController]
[Route("api/hotels")]
public class HotelsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<Hotel>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = db.Hotels.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(h => h.Name.ToLower().Contains(search.ToLower()) ||
                                     h.City.ToLower().Contains(search.ToLower()));

        var total = await query.CountAsync();
        var data = await query
            .OrderBy(h => h.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new PagedResult<Hotel>
        {
            Data = data,
            Total = total,
            Page = page,
            PageSize = pageSize
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Hotel>> GetById(int id)
    {
        var hotel = await db.Hotels
            .Include(h => h.RoomTypes)
            .FirstOrDefaultAsync(h => h.Id == id);

        if (hotel is null) return NotFound();
        return Ok(hotel);
    }

    [HttpPost]
    public async Task<ActionResult<Hotel>> Create(Hotel hotel)
    {
        hotel.CreatedAt = DateTime.UtcNow;
        db.Hotels.Add(hotel);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = hotel.Id }, hotel);
    }

    [HttpGet("{hotelId}/room-types")]
    public async Task<ActionResult<List<RoomType>>> GetRoomTypes(int hotelId)
    {
        var hotel = await db.Hotels.FindAsync(hotelId);
        if (hotel is null) return NotFound();

        var roomTypes = await db.RoomTypes
            .Where(r => r.HotelId == hotelId)
            .ToListAsync();

        return Ok(roomTypes);
    }

    [HttpPost("{hotelId}/room-types")]
    public async Task<ActionResult<RoomType>> CreateRoomType(int hotelId, RoomType roomType)
    {
        var hotel = await db.Hotels.FindAsync(hotelId);
        if (hotel is null) return NotFound();

        roomType.HotelId = hotelId;
        db.RoomTypes.Add(roomType);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetRoomTypes), new { hotelId }, roomType);
    }
}
