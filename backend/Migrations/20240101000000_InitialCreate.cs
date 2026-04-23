using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Altairis.Api.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Hotels",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(nullable: false),
                    Address = table.Column<string>(nullable: false),
                    City = table.Column<string>(nullable: false),
                    Country = table.Column<string>(nullable: false),
                    Stars = table.Column<int>(nullable: false),
                    ContactEmail = table.Column<string>(nullable: false),
                    ContactPhone = table.Column<string>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_Hotels", x => x.Id); });

            migrationBuilder.CreateTable(
                name: "RoomTypes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HotelId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Description = table.Column<string>(nullable: false),
                    Capacity = table.Column<int>(nullable: false),
                    BasePrice = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    TotalRooms = table.Column<int>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomTypes", x => x.Id);
                    table.ForeignKey("FK_RoomTypes_Hotels_HotelId", x => x.HotelId, "Hotels", "Id", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Availabilities",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HotelId = table.Column<int>(nullable: false),
                    RoomTypeId = table.Column<int>(nullable: false),
                    Date = table.Column<DateOnly>(nullable: false),
                    AvailableRooms = table.Column<int>(nullable: false),
                    Price = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Availabilities", x => x.Id);
                    table.ForeignKey("FK_Availabilities_Hotels_HotelId", x => x.HotelId, "Hotels", "Id", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey("FK_Availabilities_RoomTypes_RoomTypeId", x => x.RoomTypeId, "RoomTypes", "Id", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reservations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HotelId = table.Column<int>(nullable: false),
                    RoomTypeId = table.Column<int>(nullable: false),
                    GuestName = table.Column<string>(nullable: false),
                    GuestEmail = table.Column<string>(nullable: false),
                    GuestPhone = table.Column<string>(nullable: false),
                    CheckIn = table.Column<DateOnly>(nullable: false),
                    CheckOut = table.Column<DateOnly>(nullable: false),
                    Rooms = table.Column<int>(nullable: false),
                    TotalPrice = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Status = table.Column<string>(nullable: false),
                    Notes = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservations", x => x.Id);
                    table.ForeignKey("FK_Reservations_Hotels_HotelId", x => x.HotelId, "Hotels", "Id", onDelete: ReferentialAction.Restrict);
                    table.ForeignKey("FK_Reservations_RoomTypes_RoomTypeId", x => x.RoomTypeId, "RoomTypes", "Id", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex("IX_Availabilities_HotelId_RoomTypeId_Date", "Availabilities",
                new[] { "HotelId", "RoomTypeId", "Date" }, unique: true);
            migrationBuilder.CreateIndex("IX_RoomTypes_HotelId", "RoomTypes", "HotelId");
            migrationBuilder.CreateIndex("IX_Reservations_HotelId", "Reservations", "HotelId");
            migrationBuilder.CreateIndex("IX_Reservations_RoomTypeId", "Reservations", "RoomTypeId");
            migrationBuilder.CreateIndex("IX_Availabilities_RoomTypeId", "Availabilities", "RoomTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("Reservations");
            migrationBuilder.DropTable("Availabilities");
            migrationBuilder.DropTable("RoomTypes");
            migrationBuilder.DropTable("Hotels");
        }
    }
}
