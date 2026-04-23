namespace Altairis.Api.Models;

public class Hotel
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Address { get; set; } = "";
    public string City { get; set; } = "";
    public string Country { get; set; } = "";
    public int Stars { get; set; }
    public string ContactEmail { get; set; } = "";
    public string ContactPhone { get; set; } = "";
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RoomType> RoomTypes { get; set; } = [];
    public ICollection<Reservation> Reservations { get; set; } = [];
}
