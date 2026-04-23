namespace Altairis.Api.Models;

public class RoomType
{
    public int Id { get; set; }
    public int HotelId { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public int Capacity { get; set; }
    public decimal BasePrice { get; set; }
    public int TotalRooms { get; set; }
    public bool IsActive { get; set; } = true;

    public Hotel Hotel { get; set; } = null!;
    public ICollection<Availability> Availabilities { get; set; } = [];
}
