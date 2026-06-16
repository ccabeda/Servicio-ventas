using ServicioVentas.Application.DTOs.Ventas;
using ServicioVentas.Application.Tests.Support;
using ServicioVentas.Application.UseCases.Ventas.Commands;
using ServicioVentas.Application.UseCases.Ventas.Handlers;
using ServicioVentas.Domain.Enums;
using ServicioVentas.Domain.Models;
using Microsoft.Extensions.Logging.Abstractions;

namespace ServicioVentas.Application.Tests.Ventas;

public class CreateVentaHandlerTests
{
    [Fact]
    public async Task Handle_SinCajaAbierta_LanzaError()
    {
        var context = CreateContext();
        context.CajaRepo.CajaAbierta = null;

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => context.Handler.Handle(CreateCommand()));

        Assert.Equal("No se puede vender sin caja abierta.", exception.Message);
        Assert.Empty(context.VentaRepo.Ventas);
    }

    [Fact]
    public async Task Handle_VentaValida_DescuentaStockYRegistraVenta()
    {
        var context = CreateContext();

        var result = await context.Handler.Handle(CreateCommand());

        Assert.Equal(200, result.Total);
        Assert.Equal(3, context.Producto.Stock);
        Assert.Single(context.VentaRepo.Ventas);
        Assert.Single(context.VentaRepo.Movimientos);
        var movimientoStock = Assert.Single(context.MovimientoStockRepo.Movimientos);
        Assert.Equal(TipoMovimientoStock.Venta, movimientoStock.Tipo);
        Assert.Equal(5, movimientoStock.StockAnterior);
        Assert.Equal(3, movimientoStock.StockNuevo);
        Assert.Equal(1, context.UnitOfWork.SaveCount);
    }

    private static CreateVentaCommand CreateCommand() => new()
    {
        UsuarioId = 10,
        Venta = new CreateVentaDto
        {
            MedioPagoId = 1,
            Detalles = [new CreateVentaDetalleDto { ProductoId = 1, Cantidad = 2 }]
        }
    };

    private static VentaTestContext CreateContext()
    {
        var productoRepo = new FakeProductoRepository();
        var producto = new Producto { Id = 1, Nombre = "Alfajor", Precio = 100, Stock = 5, Activo = true };
        productoRepo.Productos.Add(producto);

        var cajaRepo = new FakeCajaRepository
        {
            CajaAbierta = new Caja { Id = 1, Abierta = true, UsuarioAperturaId = 10 }
        };
        cajaRepo.Cajas.Add(cajaRepo.CajaAbierta);

        var medioPagoRepo = new FakeMedioPagoRepository();
        medioPagoRepo.MediosPago.Add(new MedioPago { Id = 1, Nombre = "Efectivo", Activo = true });

        var ventaRepo = new FakeVentaRepository();
        var movimientoStockRepo = new FakeMovimientoStockRepository();
        var unitOfWork = new TestUnitOfWork();
        var handler = new CreateVentaHandler(
            TestMapper.Create(),
            ventaRepo,
            cajaRepo,
            productoRepo,
            productoRepo,
            movimientoStockRepo,
            medioPagoRepo,
            new FakeClienteRepository(),
            new FakeConfiguracionNegocioRepository { Principal = new ConfiguracionNegocio { DescuentoMaximoPermitido = 20, RedondeoTotal = "0" } },
            new TestClock(new DateTime(2026, 6, 16, 12, 0, 0, DateTimeKind.Utc)),
            new FakeAuditoriaService(),
            NullLogger<CreateVentaHandler>.Instance,
            unitOfWork);

        return new VentaTestContext(handler, producto, ventaRepo, cajaRepo, movimientoStockRepo, unitOfWork);
    }

    private sealed record VentaTestContext(
        CreateVentaHandler Handler,
        Producto Producto,
        FakeVentaRepository VentaRepo,
        FakeCajaRepository CajaRepo,
        FakeMovimientoStockRepository MovimientoStockRepo,
        TestUnitOfWork UnitOfWork);
}
