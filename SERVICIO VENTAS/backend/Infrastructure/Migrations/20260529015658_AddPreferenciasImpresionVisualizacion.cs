using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPreferenciasImpresionVisualizacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ImprimirCopiaTicket",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "LetraGrandePantallaTactil",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImprimirCopiaTicket",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "LetraGrandePantallaTactil",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "VistaPreviaAntesImprimir",
                table: "CONFIGURACION_NEGOCIO");
        }
    }
}
