using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditoriaEventos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AUDITORIA_EVENTO",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UsuarioId = table.Column<int>(type: "int", nullable: true),
                    Modulo = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Accion = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Entidad = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    EntidadId = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true),
                    Detalle = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ValoresAnterioresJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValoresNuevosJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ip = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AUDITORIA_EVENTO", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AUDITORIA_EVENTO_USUARIO_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "USUARIO",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AUDITORIA_EVENTO_Fecha",
                table: "AUDITORIA_EVENTO",
                column: "Fecha");

            migrationBuilder.CreateIndex(
                name: "IX_AUDITORIA_EVENTO_Modulo_Accion",
                table: "AUDITORIA_EVENTO",
                columns: new[] { "Modulo", "Accion" });

            migrationBuilder.CreateIndex(
                name: "IX_AUDITORIA_EVENTO_UsuarioId",
                table: "AUDITORIA_EVENTO",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AUDITORIA_EVENTO");
        }
    }
}
