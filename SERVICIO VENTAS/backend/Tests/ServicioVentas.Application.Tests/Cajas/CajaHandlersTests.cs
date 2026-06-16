using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.Exceptions;
using ServicioVentas.Application.Tests.Support;
using ServicioVentas.Application.UseCases.Cajas.Commands;
using ServicioVentas.Application.UseCases.Cajas.Handlers;
using ServicioVentas.Domain.Models;
using Microsoft.Extensions.Logging.Abstractions;

namespace ServicioVentas.Application.Tests.Cajas;

public class CajaHandlersTests
{
    [Fact]
    public async Task AbrirCaja_CuandoYaExisteCajaAbierta_LanzaError()
    {
        var cajaRepo = new FakeCajaRepository { CajaAbierta = new Caja { Id = 1, Abierta = true } };
        var handler = new AbrirCajaHandler(
            TestMapper.Create(),
            cajaRepo,
            cajaRepo,
            new FakeConfiguracionNegocioRepository(),
            new TestClock(DateTime.UtcNow),
            new FakeAuditoriaService(),
            NullLogger<AbrirCajaHandler>.Instance,
            new TestUnitOfWork());

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(new AbrirCajaCommand
        {
            UsuarioId = 5,
            Caja = new AbrirCajaDto { MontoInicial = 100 }
        }));

        Assert.Equal("Ya existe una caja abierta.", exception.Message);
    }

    [Fact]
    public async Task CerrarCaja_CuandoNoEsAdminYNolePertenece_LanzaForbidden()
    {
        var cajaRepo = new FakeCajaRepository
        {
            CajaAbierta = new Caja { Id = 1, Abierta = true, UsuarioAperturaId = 99 }
        };
        cajaRepo.Cajas.Add(cajaRepo.CajaAbierta);
        var handler = new CerrarCajaHandler(
            TestMapper.Create(),
            cajaRepo,
            cajaRepo,
            new FakeConfiguracionNegocioRepository(),
            new TestClock(DateTime.UtcNow),
            new FakeAuditoriaService(),
            NullLogger<CerrarCajaHandler>.Instance,
            new TestUnitOfWork());

        await Assert.ThrowsAsync<ForbiddenAccessException>(() => handler.Handle(new CerrarCajaCommand
        {
            CajaId = 1,
            UsuarioId = 5,
            EsAdmin = false,
            Caja = new CerrarCajaDto { MontoFinal = 100, MotivoCierre = "Fin de turno" }
        }));
    }
}
