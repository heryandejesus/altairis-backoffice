using System;
using Altairis.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Altairis.Api.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Altairis.Api.Models.Availability", b =>
            {
                b.Property<int>("Id").ValueGeneratedOnAdd()
                    .HasColumnType("integer")
                    .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);
                b.Property<int>("AvailableRooms").HasColumnType("integer");
                b.Property<DateOnly>("Date").HasColumnType("date");
                b.Property<int>("HotelId").HasColumnType("integer");
                b.Property<decimal>("Price").HasColumnType("decimal(10,2)");
                b.Property<int>("RoomTypeId").HasColumnType("integer");
                b.HasKey("Id");
                b.HasIndex(new[] { "HotelId", "RoomTypeId", "Date" }, "IX_Availabilities_HotelId_RoomTypeId_Date").IsUnique();
                b.HasIndex("RoomTypeId");
                b.ToTable("Availabilities");
            });

            modelBuilder.Entity("Altairis.Api.Models.Hotel", b =>
            {
                b.Property<int>("Id").ValueGeneratedOnAdd()
                    .HasColumnType("integer")
                    .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);
                b.Property<string>("Address").IsRequired().HasColumnType("text");
                b.Property<string>("City").IsRequired().HasColumnType("text");
                b.Property<string>("ContactEmail").IsRequired().HasColumnType("text");
                b.Property<string>("ContactPhone").IsRequired().HasColumnType("text");
                b.Property<string>("Country").IsRequired().HasColumnType("text");
                b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");
                b.Property<bool>("IsActive").HasColumnType("boolean");
                b.Property<string>("Name").IsRequired().HasColumnType("text");
                b.Property<int>("Stars").HasColumnType("integer");
                b.HasKey("Id");
                b.ToTable("Hotels");
            });

            modelBuilder.Entity("Altairis.Api.Models.Reservation", b =>
            {
                b.Property<int>("Id").ValueGeneratedOnAdd()
                    .HasColumnType("integer")
                    .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);
                b.Property<DateOnly>("CheckIn").HasColumnType("date");
                b.Property<DateOnly>("CheckOut").HasColumnType("date");
                b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");
                b.Property<string>("GuestEmail").IsRequired().HasColumnType("text");
                b.Property<string>("GuestName").IsRequired().HasColumnType("text");
                b.Property<string>("GuestPhone").IsRequired().HasColumnType("text");
                b.Property<int>("HotelId").HasColumnType("integer");
                b.Property<string>("Notes").HasColumnType("text");
                b.Property<int>("Rooms").HasColumnType("integer");
                b.Property<int>("RoomTypeId").HasColumnType("integer");
                b.Property<string>("Status").IsRequired().HasColumnType("text");
                b.Property<decimal>("TotalPrice").HasColumnType("decimal(10,2)");
                b.HasKey("Id");
                b.HasIndex("HotelId");
                b.HasIndex("RoomTypeId");
                b.ToTable("Reservations");
            });

            modelBuilder.Entity("Altairis.Api.Models.RoomType", b =>
            {
                b.Property<int>("Id").ValueGeneratedOnAdd()
                    .HasColumnType("integer")
                    .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);
                b.Property<decimal>("BasePrice").HasColumnType("decimal(10,2)");
                b.Property<int>("Capacity").HasColumnType("integer");
                b.Property<string>("Description").IsRequired().HasColumnType("text");
                b.Property<int>("HotelId").HasColumnType("integer");
                b.Property<bool>("IsActive").HasColumnType("boolean");
                b.Property<string>("Name").IsRequired().HasColumnType("text");
                b.Property<int>("TotalRooms").HasColumnType("integer");
                b.HasKey("Id");
                b.HasIndex("HotelId");
                b.ToTable("RoomTypes");
            });

            modelBuilder.Entity("Altairis.Api.Models.Availability", b =>
            {
                b.HasOne("Altairis.Api.Models.Hotel", "Hotel").WithMany().HasForeignKey("HotelId").OnDelete(DeleteBehavior.Cascade).IsRequired();
                b.HasOne("Altairis.Api.Models.RoomType", "RoomType").WithMany("Availabilities").HasForeignKey("RoomTypeId").OnDelete(DeleteBehavior.Cascade).IsRequired();
                b.Navigation("Hotel");
                b.Navigation("RoomType");
            });

            modelBuilder.Entity("Altairis.Api.Models.Reservation", b =>
            {
                b.HasOne("Altairis.Api.Models.Hotel", "Hotel").WithMany("Reservations").HasForeignKey("HotelId").OnDelete(DeleteBehavior.Restrict).IsRequired();
                b.HasOne("Altairis.Api.Models.RoomType", "RoomType").WithMany().HasForeignKey("RoomTypeId").OnDelete(DeleteBehavior.Cascade).IsRequired();
                b.Navigation("Hotel");
                b.Navigation("RoomType");
            });

            modelBuilder.Entity("Altairis.Api.Models.RoomType", b =>
            {
                b.HasOne("Altairis.Api.Models.Hotel", "Hotel").WithMany("RoomTypes").HasForeignKey("HotelId").OnDelete(DeleteBehavior.Cascade).IsRequired();
                b.Navigation("Hotel");
            });

            modelBuilder.Entity("Altairis.Api.Models.Hotel", b =>
            {
                b.Navigation("Reservations");
                b.Navigation("RoomTypes");
            });

            modelBuilder.Entity("Altairis.Api.Models.RoomType", b =>
            {
                b.Navigation("Availabilities");
            });
#pragma warning restore 612, 618
        }
    }
}
