using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveActivaCategoriaProducto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Activa",
                table: "CATEGORIA_PRODUCTO");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Activa",
                table: "CATEGORIA_PRODUCTO",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 1,
                column: "Activa",
                value: true);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 2,
                column: "Activa",
                value: true);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 3,
                column: "Activa",
                value: true);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 4,
                column: "Activa",
                value: true);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 5,
                column: "Activa",
                value: true);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 6,
                column: "Activa",
                value: true);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 7,
                column: "Activa",
                value: true);
        }
    }
}
