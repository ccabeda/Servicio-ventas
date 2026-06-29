using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOpcionesVisiblesTicketConfiguracion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ImprimirClienteTicket",
                table: "CONFIGURACION_TICKET",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "ImprimirDescuentoRecargoTicket",
                table: "CONFIGURACION_TICKET",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "ImprimirMedioPagoTicket",
                table: "CONFIGURACION_TICKET",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "ImprimirMensajeCierreTicket",
                table: "CONFIGURACION_TICKET",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "ImprimirSubtotalTotalTicket",
                table: "CONFIGURACION_TICKET",
                type: "bit",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImprimirClienteTicket",
                table: "CONFIGURACION_TICKET");

            migrationBuilder.DropColumn(
                name: "ImprimirDescuentoRecargoTicket",
                table: "CONFIGURACION_TICKET");

            migrationBuilder.DropColumn(
                name: "ImprimirMedioPagoTicket",
                table: "CONFIGURACION_TICKET");

            migrationBuilder.DropColumn(
                name: "ImprimirMensajeCierreTicket",
                table: "CONFIGURACION_TICKET");

            migrationBuilder.DropColumn(
                name: "ImprimirSubtotalTotalTicket",
                table: "CONFIGURACION_TICKET");
        }
    }
}
