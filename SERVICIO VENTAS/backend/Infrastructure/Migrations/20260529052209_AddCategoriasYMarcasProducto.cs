using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoriasYMarcasProducto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoriaId",
                table: "PRODUCTO",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MarcaId",
                table: "PRODUCTO",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CATEGORIA_PRODUCTO",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Icono = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Color = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Activa = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CATEGORIA_PRODUCTO", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MARCA_PRODUCTO",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Activa = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MARCA_PRODUCTO", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PRODUCTO_CategoriaId",
                table: "PRODUCTO",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_PRODUCTO_MarcaId",
                table: "PRODUCTO",
                column: "MarcaId");

            migrationBuilder.CreateIndex(
                name: "IX_CATEGORIA_PRODUCTO_Nombre",
                table: "CATEGORIA_PRODUCTO",
                column: "Nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MARCA_PRODUCTO_Nombre",
                table: "MARCA_PRODUCTO",
                column: "Nombre",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PRODUCTO_CATEGORIA_PRODUCTO_CategoriaId",
                table: "PRODUCTO",
                column: "CategoriaId",
                principalTable: "CATEGORIA_PRODUCTO",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_PRODUCTO_MARCA_PRODUCTO_MarcaId",
                table: "PRODUCTO",
                column: "MarcaId",
                principalTable: "MARCA_PRODUCTO",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PRODUCTO_CATEGORIA_PRODUCTO_CategoriaId",
                table: "PRODUCTO");

            migrationBuilder.DropForeignKey(
                name: "FK_PRODUCTO_MARCA_PRODUCTO_MarcaId",
                table: "PRODUCTO");

            migrationBuilder.DropTable(
                name: "CATEGORIA_PRODUCTO");

            migrationBuilder.DropTable(
                name: "MARCA_PRODUCTO");

            migrationBuilder.DropIndex(
                name: "IX_PRODUCTO_CategoriaId",
                table: "PRODUCTO");

            migrationBuilder.DropIndex(
                name: "IX_PRODUCTO_MarcaId",
                table: "PRODUCTO");

            migrationBuilder.DropColumn(
                name: "CategoriaId",
                table: "PRODUCTO");

            migrationBuilder.DropColumn(
                name: "MarcaId",
                table: "PRODUCTO");
        }
    }
}
