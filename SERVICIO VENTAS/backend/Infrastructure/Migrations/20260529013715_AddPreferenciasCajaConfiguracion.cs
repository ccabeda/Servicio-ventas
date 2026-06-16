using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPreferenciasCajaConfiguracion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ImprimirResumenCerrarCaja",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MontoMinimoAperturaCaja",
                table: "CONFIGURACION_NEGOCIO",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "PedirMotivoCerrarCaja",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "MotivoCierre",
                table: "CAJA",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImprimirResumenCerrarCaja",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "MontoMinimoAperturaCaja",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "PedirMotivoCerrarCaja",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "MotivoCierre",
                table: "CAJA");
        }
    }
}
