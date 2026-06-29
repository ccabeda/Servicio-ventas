using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServicioVentas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddConfiguracionTicket : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CONFIGURACION_TICKET",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImpresoraId = table.Column<int>(type: "int", nullable: true),
                    ImpresoraNombreSistema = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: true),
                    MensajeTicket = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    AnchoPapelMm = table.Column<int>(type: "int", nullable: false, defaultValue: 80),
                    UsaAnchoPersonalizado = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    UsaTicketTermico = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    VistaPreviaAntesImprimir = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    ImprimirCopiaTicket = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    LetraGrandePantallaTactil = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    ImprimirFechaHoraTicket = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    ImprimirCajeroTicket = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    ImprimirNumeroTicket = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CorteAutomatico = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CONFIGURACION_TICKET", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CONFIGURACION_TICKET_IMPRESORA_ImpresoraId",
                        column: x => x.ImpresoraId,
                        principalTable: "IMPRESORA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CONFIGURACION_TICKET_ImpresoraId",
                table: "CONFIGURACION_TICKET",
                column: "ImpresoraId");

            migrationBuilder.Sql("""
                INSERT INTO CONFIGURACION_TICKET (
                    ImpresoraNombreSistema,
                    MensajeTicket,
                    AnchoPapelMm,
                    UsaAnchoPersonalizado,
                    UsaTicketTermico,
                    VistaPreviaAntesImprimir,
                    ImprimirCopiaTicket,
                    LetraGrandePantallaTactil,
                    ImprimirFechaHoraTicket,
                    ImprimirCajeroTicket,
                    ImprimirNumeroTicket,
                    CorteAutomatico
                )
                SELECT TOP(1)
                    ImpresoraTicket,
                    MensajeTicket,
                    80,
                    CAST(0 AS bit),
                    UsaTicketTermico,
                    VistaPreviaAntesImprimir,
                    ImprimirCopiaTicket,
                    LetraGrandePantallaTactil,
                    ImprimirFechaHoraTicket,
                    ImprimirCajeroTicket,
                    ImprimirNumeroTicket,
                    UsaTicketTermico
                FROM CONFIGURACION_NEGOCIO
                WHERE NOT EXISTS (SELECT 1 FROM CONFIGURACION_TICKET);
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CONFIGURACION_TICKET");
        }
    }
}
