using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RestoreSeedCategoriasProductoBase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "CATEGORIA_PRODUCTO",
                columns: new[] { "Id", "Activa", "Color", "Icono", "Nombre" },
                values: new object[,]
                {
                    { 1, true, "#2563eb", "bottle", "Bebidas" },
                    { 2, true, "#d97706", "basket", "Almacen" },
                    { 3, true, "#2563eb", "milk", "Lacteos" },
                    { 4, true, "#16a34a", "cleaner", "Limpieza" },
                    { 5, true, "#ea580c", "bread", "Panaderia" },
                    { 6, true, "#9333ea", "candy", "Golosinas" },
                    { 7, true, "#64748b", "more", "Otros" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 7);
        }
    }
}
