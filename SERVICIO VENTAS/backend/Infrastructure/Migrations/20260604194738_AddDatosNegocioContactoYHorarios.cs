using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDatosNegocioContactoYHorarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DiasAtencion",
                table: "CONFIGURACION_NEGOCIO",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "CONFIGURACION_NEGOCIO",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HorarioApertura",
                table: "CONFIGURACION_NEGOCIO",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HorarioCierre",
                table: "CONFIGURACION_NEGOCIO",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiasAtencion",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "HorarioApertura",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.DropColumn(
                name: "HorarioCierre",
                table: "CONFIGURACION_NEGOCIO");
        }
    }
}
