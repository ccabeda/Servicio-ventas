using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddImpuestosYDetalleFiscal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "ImporteImpuesto",
                table: "VENTA_DETALLE",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ImporteNeto",
                table: "VENTA_DETALLE",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "ImpuestoId",
                table: "VENTA_DETALLE",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImpuestoNombre",
                table: "VENTA_DETALLE",
                type: "nvarchar(80)",
                maxLength: 80,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "ImpuestoPorcentaje",
                table: "VENTA_DETALLE",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "ImpuestoId",
                table: "PRODUCTO",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ImpuestoId",
                table: "CATEGORIA_PRODUCTO",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "IMPUESTO",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Porcentaje = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    EsPredeterminado = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IMPUESTO", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 1,
                column: "ImpuestoId",
                value: null);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 2,
                column: "ImpuestoId",
                value: null);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 3,
                column: "ImpuestoId",
                value: null);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 4,
                column: "ImpuestoId",
                value: null);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 5,
                column: "ImpuestoId",
                value: null);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 6,
                column: "ImpuestoId",
                value: null);

            migrationBuilder.UpdateData(
                table: "CATEGORIA_PRODUCTO",
                keyColumn: "Id",
                keyValue: 7,
                column: "ImpuestoId",
                value: null);

            migrationBuilder.InsertData(
                table: "IMPUESTO",
                columns: new[] { "Id", "Activo", "EsPredeterminado", "FechaCreacion", "Nombre", "Porcentaje" },
                values: new object[] { 1, true, true, new DateTime(2026, 6, 29, 23, 50, 18, 736, DateTimeKind.Utc).AddTicks(4850), "IVA General", 21m });

            migrationBuilder.InsertData(
                table: "IMPUESTO",
                columns: new[] { "Id", "Activo", "FechaCreacion", "Nombre", "Porcentaje" },
                values: new object[,]
                {
                    { 2, true, new DateTime(2026, 6, 29, 23, 50, 18, 736, DateTimeKind.Utc).AddTicks(4857), "IVA Reducido", 10.5m },
                    { 3, true, new DateTime(2026, 6, 29, 23, 50, 18, 736, DateTimeKind.Utc).AddTicks(4859), "Exento", 0m }
                });

            migrationBuilder.CreateIndex(
                name: "IX_VENTA_DETALLE_ImpuestoId",
                table: "VENTA_DETALLE",
                column: "ImpuestoId");

            migrationBuilder.CreateIndex(
                name: "IX_PRODUCTO_ImpuestoId",
                table: "PRODUCTO",
                column: "ImpuestoId");

            migrationBuilder.CreateIndex(
                name: "IX_CATEGORIA_PRODUCTO_ImpuestoId",
                table: "CATEGORIA_PRODUCTO",
                column: "ImpuestoId");

            migrationBuilder.CreateIndex(
                name: "IX_IMPUESTO_EsPredeterminado",
                table: "IMPUESTO",
                column: "EsPredeterminado",
                unique: true,
                filter: "[EsPredeterminado] = 1");

            migrationBuilder.CreateIndex(
                name: "IX_IMPUESTO_Nombre",
                table: "IMPUESTO",
                column: "Nombre",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CATEGORIA_PRODUCTO_IMPUESTO_ImpuestoId",
                table: "CATEGORIA_PRODUCTO",
                column: "ImpuestoId",
                principalTable: "IMPUESTO",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_PRODUCTO_IMPUESTO_ImpuestoId",
                table: "PRODUCTO",
                column: "ImpuestoId",
                principalTable: "IMPUESTO",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_VENTA_DETALLE_IMPUESTO_ImpuestoId",
                table: "VENTA_DETALLE",
                column: "ImpuestoId",
                principalTable: "IMPUESTO",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CATEGORIA_PRODUCTO_IMPUESTO_ImpuestoId",
                table: "CATEGORIA_PRODUCTO");

            migrationBuilder.DropForeignKey(
                name: "FK_PRODUCTO_IMPUESTO_ImpuestoId",
                table: "PRODUCTO");

            migrationBuilder.DropForeignKey(
                name: "FK_VENTA_DETALLE_IMPUESTO_ImpuestoId",
                table: "VENTA_DETALLE");

            migrationBuilder.DropTable(
                name: "IMPUESTO");

            migrationBuilder.DropIndex(
                name: "IX_VENTA_DETALLE_ImpuestoId",
                table: "VENTA_DETALLE");

            migrationBuilder.DropIndex(
                name: "IX_PRODUCTO_ImpuestoId",
                table: "PRODUCTO");

            migrationBuilder.DropIndex(
                name: "IX_CATEGORIA_PRODUCTO_ImpuestoId",
                table: "CATEGORIA_PRODUCTO");

            migrationBuilder.DropColumn(
                name: "ImporteImpuesto",
                table: "VENTA_DETALLE");

            migrationBuilder.DropColumn(
                name: "ImporteNeto",
                table: "VENTA_DETALLE");

            migrationBuilder.DropColumn(
                name: "ImpuestoId",
                table: "VENTA_DETALLE");

            migrationBuilder.DropColumn(
                name: "ImpuestoNombre",
                table: "VENTA_DETALLE");

            migrationBuilder.DropColumn(
                name: "ImpuestoPorcentaje",
                table: "VENTA_DETALLE");

            migrationBuilder.DropColumn(
                name: "ImpuestoId",
                table: "PRODUCTO");

            migrationBuilder.DropColumn(
                name: "ImpuestoId",
                table: "CATEGORIA_PRODUCTO");
        }
    }
}
