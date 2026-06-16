using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPreferenciasFormatoRegional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FormatoFecha",
                table: "CONFIGURACION_NEGOCIO",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "dd/MM/yyyy");

            migrationBuilder.AddColumn<string>(
                name: "FormatoHora",
                table: "CONFIGURACION_NEGOCIO",
                type: "nvarchar(5)",
                maxLength: 5,
                nullable: false,
                defaultValue: "24");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FormatoFecha",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "FormatoHora",
                table: "CONFIGURACION_NEGOCIO");
        }
    }
}
