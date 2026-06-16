using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTicketFieldsFromConfiguracionNegocio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImpresoraTicket",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "ImprimirCajeroTicket",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "ImprimirCopiaTicket",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "ImprimirFechaHoraTicket",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "ImprimirNumeroTicket",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "LetraGrandePantallaTactil",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "MensajeTicket",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "UsaTicketTermico",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "VistaPreviaAntesImprimir",
                table: "CONFIGURACION_NEGOCIO");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImpresoraTicket",
                table: "CONFIGURACION_NEGOCIO",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ImprimirCajeroTicket",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "ImprimirCopiaTicket",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: false);

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

            migrationBuilder.AddColumn<bool>(
                name: "LetraGrandePantallaTactil",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "MensajeTicket",
                table: "CONFIGURACION_NEGOCIO",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "UsaTicketTermico",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "VistaPreviaAntesImprimir",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: true);
        }
    }
}
