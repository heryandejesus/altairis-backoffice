using Altairis.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Altairis.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Hotels.AnyAsync()) return;

        var hotels = new List<Hotel>
        {
            new() {
                Name = "Grand Palace Barcelona",
                Address = "Via Laietana 12",
                City = "Barcelona",
                Country = "Spain",
                Stars = 5,
                ContactEmail = "reservas@grandpalace.es",
                ContactPhone = "+34 93 123 4567",
                CreatedAt = DateTime.UtcNow.AddMonths(-12)
            },
            new() {
                Name = "Hotel Mediterráneo",
                Address = "Paseo Marítimo 45",
                City = "Valencia",
                Country = "Spain",
                Stars = 4,
                ContactEmail = "info@hotelmed.es",
                ContactPhone = "+34 96 234 5678",
                CreatedAt = DateTime.UtcNow.AddMonths(-8)
            },
            new() {
                Name = "Boutique Alhambra Suites",
                Address = "Calle Reyes Católicos 7",
                City = "Granada",
                Country = "Spain",
                Stars = 4,
                ContactEmail = "contacto@alhambrasuites.es",
                ContactPhone = "+34 958 345 6789",
                CreatedAt = DateTime.UtcNow.AddMonths(-6)
            },
            new() {
                Name = "Palacio del Retiro",
                Address = "Calle Alfonso XII 20",
                City = "Madrid",
                Country = "Spain",
                Stars = 5,
                ContactEmail = "reservas@palacioretiro.es",
                ContactPhone = "+34 91 456 7890",
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            },
            new() {
                Name = "Costa Dorada Resort",
                Address = "Avenida de la Costa 100",
                City = "Tarragona",
                Country = "Spain",
                Stars = 3,
                ContactEmail = "resort@costadorada.es",
                ContactPhone = "+34 977 567 8901",
                CreatedAt = DateTime.UtcNow.AddMonths(-1)
            }
        };

        context.Hotels.AddRange(hotels);
        await context.SaveChangesAsync();

        var roomTypes = new List<RoomType>
        {
            new() { HotelId = hotels[0].Id, Name = "Suite Presidencial", Description = "Suite de lujo con vistas panorámicas", Capacity = 2, BasePrice = 850, TotalRooms = 3 },
            new() { HotelId = hotels[0].Id, Name = "Habitación Deluxe", Description = "Habitación premium con balcón", Capacity = 2, BasePrice = 320, TotalRooms = 20 },
            new() { HotelId = hotels[0].Id, Name = "Habitación Estándar", Description = "Habitación confortable y elegante", Capacity = 2, BasePrice = 180, TotalRooms = 50 },

            new() { HotelId = hotels[1].Id, Name = "Suite Mediterránea", Description = "Suite con vistas al mar", Capacity = 2, BasePrice = 550, TotalRooms = 5 },
            new() { HotelId = hotels[1].Id, Name = "Habitación Superior", Description = "Habitación con vistas al mar", Capacity = 2, BasePrice = 220, TotalRooms = 30 },
            new() { HotelId = hotels[1].Id, Name = "Habitación Estándar", Description = "Habitación cómoda con jardín", Capacity = 2, BasePrice = 140, TotalRooms = 45 },

            new() { HotelId = hotels[2].Id, Name = "Suite Nasrid", Description = "Suite inspirada en la arquitectura nazarí", Capacity = 2, BasePrice = 480, TotalRooms = 4 },
            new() { HotelId = hotels[2].Id, Name = "Habitación Superior", Description = "Habitación con vistas a la Alhambra", Capacity = 2, BasePrice = 210, TotalRooms = 18 },

            new() { HotelId = hotels[3].Id, Name = "Suite Real", Description = "Suite de lujo con salón privado", Capacity = 4, BasePrice = 1200, TotalRooms = 2 },
            new() { HotelId = hotels[3].Id, Name = "Habitación Deluxe", Description = "Habitación con vistas al Retiro", Capacity = 2, BasePrice = 380, TotalRooms = 25 },

            new() { HotelId = hotels[4].Id, Name = "Bungalow Premium", Description = "Bungalow con acceso directo a la piscina", Capacity = 4, BasePrice = 290, TotalRooms = 10 },
            new() { HotelId = hotels[4].Id, Name = "Habitación Estándar", Description = "Habitación funcional cerca de la playa", Capacity = 2, BasePrice = 95, TotalRooms = 60 },
        };

        context.RoomTypes.AddRange(roomTypes);
        await context.SaveChangesAsync();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var availabilities = new List<Availability>();
        var rng = new Random(42);

        foreach (var rt in roomTypes)
        {
            for (int i = 0; i < 60; i++)
            {
                var date = today.AddDays(i);
                availabilities.Add(new Availability
                {
                    HotelId = rt.HotelId,
                    RoomTypeId = rt.Id,
                    Date = date,
                    AvailableRooms = rng.Next(0, rt.TotalRooms + 1),
                    Price = rt.BasePrice * (decimal)(1 + rng.NextDouble() * 0.2 - 0.1)
                });
            }
        }

        context.Availabilities.AddRange(availabilities);
        await context.SaveChangesAsync();

        var reservations = new List<Reservation>
        {
            new() {
                HotelId = hotels[0].Id, RoomTypeId = roomTypes[1].Id,
                GuestName = "Carlos Martínez", GuestEmail = "carlos@empresa.com", GuestPhone = "+34 600 111 222",
                CheckIn = today.AddDays(-2), CheckOut = today.AddDays(3), Rooms = 1, TotalPrice = 1600,
                Status = "Confirmed", CreatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new() {
                HotelId = hotels[1].Id, RoomTypeId = roomTypes[4].Id,
                GuestName = "Ana García", GuestEmail = "ana.garcia@corp.es", GuestPhone = "+34 611 222 333",
                CheckIn = today, CheckOut = today.AddDays(5), Rooms = 2, TotalPrice = 2200,
                Status = "Confirmed", CreatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new() {
                HotelId = hotels[2].Id, RoomTypeId = roomTypes[7].Id,
                GuestName = "Pedro Sánchez", GuestEmail = "pedro.s@viajes.com", GuestPhone = "+34 622 333 444",
                CheckIn = today.AddDays(1), CheckOut = today.AddDays(4), Rooms = 1, TotalPrice = 630,
                Status = "Confirmed", CreatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new() {
                HotelId = hotels[3].Id, RoomTypeId = roomTypes[9].Id,
                GuestName = "Laura Fernández", GuestEmail = "lfernandez@hotel.com", GuestPhone = "+34 633 444 555",
                CheckIn = today.AddDays(-1), CheckOut = today.AddDays(2), Rooms = 1, TotalPrice = 1140,
                Status = "Confirmed", CreatedAt = DateTime.UtcNow.AddDays(-4)
            },
            new() {
                HotelId = hotels[0].Id, RoomTypeId = roomTypes[0].Id,
                GuestName = "Roberto Iglesias", GuestEmail = "r.iglesias@luxury.es", GuestPhone = "+34 644 555 666",
                CheckIn = today.AddDays(7), CheckOut = today.AddDays(10), Rooms = 1, TotalPrice = 2550,
                Status = "Confirmed", CreatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new() {
                HotelId = hotels[4].Id, RoomTypeId = roomTypes[11].Id,
                GuestName = "María López", GuestEmail = "m.lopez@familia.es", GuestPhone = "+34 655 666 777",
                CheckIn = today.AddDays(14), CheckOut = today.AddDays(21), Rooms = 2, TotalPrice = 1330,
                Status = "Pending", CreatedAt = DateTime.UtcNow
            },
        };

        context.Reservations.AddRange(reservations);
        await context.SaveChangesAsync();
    }
}
