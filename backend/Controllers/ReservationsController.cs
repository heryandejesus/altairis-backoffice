using Altairis.Api.Data;
using Altairis.Api.DTOs;
using Altairis.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Altairis.Api.Controllers;

[ApiController]
[Route("api/reservations")]
public class ReservationsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetAll(
        [FromQuery] int? hotelId,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = db.Reservations
            .Include(r => r.Hotel)
            .Include(r => r.RoomType)
            .AsQueryable();

        if (hotelId.HasValue)
            query = query.Where(r => r.HotelId == hotelId.Value);

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(r => r.Status == status);

        var total = await query.CountAsync();
        var data = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new
            {
                r.Id,
                r.HotelId,
                HotelName = r.Hotel.Name,
                r.RoomTypeId,
                RoomTypeName = r.RoomType.Name,
                r.GuestName,
                r.GuestEmail,
                r.GuestPhone,
                CheckIn = r.CheckIn.ToString("yyyy-MM-dd"),
                CheckOut = r.CheckOut.ToString("yyyy-MM-dd"),
                r.Rooms,
                r.TotalPrice,
                r.Status,
                r.Notes,
                r.CreatedAt
            })
            .ToListAsync();

        return Ok(new { data, total, page, pageSize, totalPages = (int)Math.Ceiling((double)total / pageSize) });
    }

    [HttpPost]
    public async Task<ActionResult<Reservation>> Create(Reservation reservation)
    {
        reservation.CreatedAt = DateTime.UtcNow;
        db.Reservations.Add(reservation);
        await db.SaveChangesAsync();

        var created = await db.Reservations
            .Include(r => r.Hotel)
            .Include(r => r.RoomType)
            .FirstAsync(r => r.Id == reservation.Id);

        return CreatedAtAction(nameof(GetAll), null, created);
    }

    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetStats()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var totalHotels = await db.Hotels.CountAsync();
        var todayCheckIns = await db.Reservations
            .CountAsync(r => r.CheckIn == today && r.Status == "Confirmed");
        var activeReservations = await db.Reservations
            .CountAsync(r => r.CheckIn <= today && r.CheckOut >= today && r.Status == "Confirmed");
        var totalRooms = await db.RoomTypes.SumAsync(rt => rt.TotalRooms);
        var occupancyRate = totalRooms > 0
            ? Math.Round((double)activeReservations / totalRooms * 100, 1)
            : 0;
        var monthRevenue = await db.Reservations
            .Where(r => r.CreatedAt.Month == DateTime.UtcNow.Month &&
                        r.CreatedAt.Year == DateTime.UtcNow.Year &&
                        r.Status == "Confirmed")
            .SumAsync(r => r.TotalPrice);

        return Ok(new
        {
            TotalHotels = totalHotels,
            TodayCheckIns = todayCheckIns,
            ActiveReservations = activeReservations,
            OccupancyRate = occupancyRate,
            MonthRevenue = monthRevenue
        });
    }
}
