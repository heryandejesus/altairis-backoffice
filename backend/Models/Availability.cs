namespace Altairis.Api.Models;

public class Availability
{
    public int Id { get; set; }
    public int HotelId { get; set; }
    public int RoomTypeId { get; set; }
    public DateOnly Date { get; set; }
    public int AvailableRooms { get; set; }
    public decimal Price { get; set; }

    public Hotel Hotel { get; set; } = null!;
    public RoomType RoomType { get; set; } = null!;
}
