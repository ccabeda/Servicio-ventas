using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddImprimirDesgloseImpuestosTicket : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ImprimirDesgloseImpuestosTicket",
                table: "CONFIGURACION_TICKET",
                type: "bit",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImprimirDesgloseImpuestosTicket",
                table: "CONFIGURACION_TICKET");
        }
    }
}
