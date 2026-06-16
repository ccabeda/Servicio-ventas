using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPreferenciasVentasConfiguracion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ConfirmarEliminarItemCarrito",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "MantenerClienteAlFinalizarVenta",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "MostrarStockEnBusquedaProductos",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConfirmarEliminarItemCarrito",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "MantenerClienteAlFinalizarVenta",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "MostrarStockEnBusquedaProductos",
                table: "CONFIGURACION_NEGOCIO");
        }
    }
}
