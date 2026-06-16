using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddColorPrincipalConfiguracion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ColorPrincipal",
                table: "CONFIGURACION_NEGOCIO",
                type: "nvarchar(7)",
                maxLength: 7,
                nullable: false,
                defaultValue: "#ef0000");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColorPrincipal",
                table: "CONFIGURACION_NEGOCIO");
        }
    }
}
