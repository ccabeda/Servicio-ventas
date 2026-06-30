using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAplicarImpuestosEnVentas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AplicarImpuestosEnVentas",
                table: "CONFIGURACION_NEGOCIO",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.UpdateData(
                table: "IMPUESTO",
                keyColumn: "Id",
                keyValue: 1,
                column: "FechaCreacion",
                value: new DateTime(2026, 6, 29, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "IMPUESTO",
                keyColumn: "Id",
                keyValue: 2,
                column: "FechaCreacion",
                value: new DateTime(2026, 6, 29, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "IMPUESTO",
                keyColumn: "Id",
                keyValue: 3,
                column: "FechaCreacion",
                value: new DateTime(2026, 6, 29, 0, 0, 0, 0, DateTimeKind.Utc));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AplicarImpuestosEnVentas",
                table: "CONFIGURACION_NEGOCIO");

            migrationBuilder.UpdateData(
                table: "IMPUESTO",
                keyColumn: "Id",
                keyValue: 1,
                column: "FechaCreacion",
                value: new DateTime(2026, 6, 29, 23, 50, 18, 736, DateTimeKind.Utc).AddTicks(4850));

            migrationBuilder.UpdateData(
                table: "IMPUESTO",
                keyColumn: "Id",
                keyValue: 2,
                column: "FechaCreacion",
                value: new DateTime(2026, 6, 29, 23, 50, 18, 736, DateTimeKind.Utc).AddTicks(4857));

            migrationBuilder.UpdateData(
                table: "IMPUESTO",
                keyColumn: "Id",
                keyValue: 3,
                column: "FechaCreacion",
                value: new DateTime(2026, 6, 29, 23, 50, 18, 736, DateTimeKind.Utc).AddTicks(4859));
        }
    }
}
