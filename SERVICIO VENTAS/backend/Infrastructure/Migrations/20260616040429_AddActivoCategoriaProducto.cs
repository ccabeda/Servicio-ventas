using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddActivoCategoriaProducto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Activo",
                table: "CATEGORIA_PRODUCTO",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 1,
                column: "Activo",
                value: true);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 2,
                column: "Activo",
                value: true);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 3,
                column: "Activo",
                value: true);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 4,
                column: "Activo",
                value: true);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 5,
                column: "Activo",
                value: true);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 6,
                column: "Activo",
                value: true);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 7,
                column: "Activo",
                value: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Activo",
                table: "CATEGORIA_PRODUCTO");
        }
    }
}
