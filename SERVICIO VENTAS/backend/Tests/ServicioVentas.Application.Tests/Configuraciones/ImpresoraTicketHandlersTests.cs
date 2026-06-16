using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.Tests.Support;
using ServicioVentas.Application.UseCases.Configuraciones.Commands;
using ServicioVentas.Application.UseCases.Configuraciones.Handlers;
using ServicioVentas.Application.UseCases.Configuraciones.Queries;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.Tests.Configuraciones;

public class ImpresoraTicketHandlersTests
{
    [Fact]
    public async Task CreateImpresora_CuandoNombreSistemaNoDisponible_LanzaError()
    {
        var impresoraRepo = new FakeImpresoraRepository();
        var printerSystem = new FakePrinterSystemService { ThrowOnEnsure = true };
        var handler = new CreateImpresoraHandler(TestMapper.Create(), impresoraRepo, impresoraRepo, printerSystem);

        await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(new CreateImpresoraCommand
        {
            Impresora = new CreateImpresoraDto
            {
                Nombre = "Caja",
                NombreSistema = "EPSON TM",
                Tipo = "Ticket",
                AnchoPapelMm = 80
            }
        }));

        Assert.Empty(impresoraRepo.Impresoras);
        Assert.Equal(["EPSON TM"], printerSystem.EnsuredPrinters);
    }

    [Fact]
    public async Task GetConfiguracionTicketPrincipal_CuandoNoExiste_CreaConfiguracion()
    {
        var repo = new FakeConfiguracionTicketRepository();
        var handler = new GetConfiguracionTicketPrincipalHandler(TestMapper.Create(), repo, repo);

        var result = await handler.Handle(new GetConfiguracionTicketPrincipalQuery());

        Assert.Equal(1, result.Id);
        Assert.Equal(80, result.AnchoPapelMm);
        Assert.Equal(1, repo.SaveCount);
    }

    [Fact]
    public async Task UpdateConfiguracionTicket_CuandoImpresoraNoExiste_LanzaError()
    {
        var ticketRepo = new FakeConfiguracionTicketRepository
        {
            Principal = new ConfiguracionTicket { Id = 1, AnchoPapelMm = 80 }
        };
        var impresoraRepo = new FakeImpresoraRepository();
        var handler = new UpdateConfiguracionTicketHandler(TestMapper.Create(), ticketRepo, ticketRepo, impresoraRepo);

        var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(new UpdateConfiguracionTicketCommand
        {
            Id = 1,
            Configuracion = new UpdateConfiguracionTicketDto
            {
                ImpresoraId = 55,
                AnchoPapelMm = 80
            }
        }));

        Assert.Equal("Impresora no encontrada.", exception.Message);
        Assert.Equal(0, ticketRepo.SaveCount);
    }
}
