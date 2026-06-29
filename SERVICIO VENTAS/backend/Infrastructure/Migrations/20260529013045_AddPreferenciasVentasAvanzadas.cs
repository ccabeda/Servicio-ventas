using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPreferenciasVentasAvanzadas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DescuentoMaximoPermitido",
                table: "CONFIGURACION_NEGOCIO",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 20m);

            migrationBuilder.AddColumn<bool>(
                name: "PedirCantidadAlAgregarProducto",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "RedondeoTotal",
                table: "CONFIGURACION_NEGOCIO",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "0.05");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescuentoMaximoPermitido",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "PedirCantidadAlAgregarProducto",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "RedondeoTotal",
                table: "CONFIGURACION_NEGOCIO");
        }
    }
}
