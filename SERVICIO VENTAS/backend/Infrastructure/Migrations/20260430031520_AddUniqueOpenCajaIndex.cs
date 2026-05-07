using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueOpenCajaIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_CAJA_Abierta",
                table: "CAJA",
                column: "Abierta",
                unique: true,
                filter: "[Abierta] = 1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CAJA_Abierta",
                table: "CAJA");
        }
    }
}
