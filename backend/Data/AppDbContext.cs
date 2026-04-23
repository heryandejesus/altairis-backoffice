using Altairis.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Altairis.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Hotel> Hotels => Set<Hotel>();
    public DbSet<RoomType> RoomTypes => Set<RoomType>();
    public DbSet<Availability> Availabilities => Set<Availability>();
    public DbSet<Reservation> Reservations => Set<Reservation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Hotel>()
            .HasMany(h => h.RoomTypes)
            .WithOne(r => r.Hotel)
            .HasForeignKey(r => r.HotelId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Hotel>()
            .HasMany(h => h.Reservations)
            .WithOne(r => r.Hotel)
            .HasForeignKey(r => r.HotelId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Availability>()
            .HasIndex(a => new { a.HotelId, a.RoomTypeId, a.Date })
            .IsUnique();

        modelBuilder.Entity<Reservation>()
            .Property(r => r.TotalPrice)
            .HasColumnType("decimal(10,2)");

        modelBuilder.Entity<RoomType>()
            .Property(r => r.BasePrice)
            .HasColumnType("decimal(10,2)");

        modelBuilder.Entity<Availability>()
            .Property(a => a.Price)
            .HasColumnType("decimal(10,2)");
    }
}
