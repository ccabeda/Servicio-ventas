using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddImpresorasConfiguradas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IMPRESORA",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    NombreSistema = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: false),
                    Modelo = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    Conexion = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true),
                    Puerto = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true),
                    Tipo = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false, defaultValue: "Ticket"),
                    AnchoPapelMm = table.Column<int>(type: "int", nullable: false, defaultValue: 80),
                    EsPredeterminada = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CorteAutomatico = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    DensidadImpresion = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Media"),
                    Activa = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IMPRESORA", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IMPRESORA_Nombre",
                table: "IMPRESORA",
                column: "Nombre");

            migrationBuilder.CreateIndex(
                name: "IX_IMPRESORA_NombreSistema",
                table: "IMPRESORA",
                column: "NombreSistema");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IMPRESORA");
        }
    }
}
