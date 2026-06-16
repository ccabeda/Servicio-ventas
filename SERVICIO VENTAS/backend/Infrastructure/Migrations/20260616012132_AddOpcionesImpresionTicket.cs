using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOpcionesImpresionTicket : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ImprimirCajeroTicket",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "ImprimirFechaHoraTicket",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "ImprimirNumeroTicket",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImprimirCajeroTicket",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "ImprimirFechaHoraTicket",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "ImprimirNumeroTicket",
                table: "CONFIGURACION_NEGOCIO");
        }
    }
}
