using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.Tests.Support;
using ServicioVentas.Application.UseCases.Productos.Commands;
using ServicioVentas.Application.UseCases.Productos.Handlers;
using ServicioVentas.Domain.Enums;
using ServicioVentas.Domain.Models;
using Microsoft.Extensions.Logging.Abstractions;

namespace ServicioVentas.Application.Tests.Stock;

public class AjustarStockProductoHandlerTests
{
    [Fact]
    public async Task Handle_Ingreso_ActualizaStockYRegistraMovimiento()
    {
        var productoRepo = new FakeProductoRepository();
        var movimientoRepo = new FakeMovimientoStockRepository();
        var clock = new TestClock(new DateTime(2026, 6, 16, 10, 0, 0, DateTimeKind.Utc));
        productoRepo.Productos.Add(new Producto { Id = 1, Nombre = "Coca", Stock = 5, Precio = 100, Activo = true });
        var handler = new AjustarStockProductoHandler(TestMapper.Create(), productoRepo, productoRepo, movimientoRepo, new FakeAuditoriaService(), NullLogger<AjustarStockProductoHandler>.Instance, clock);

        var result = await handler.Handle(new AjustarStockProductoCommand
        {
            ProductoId = 1,
            UsuarioId = 7,
            Movimiento = new AjustarStockProductoDto
            {
                Tipo = TipoMovimientoStock.Ingreso,
                Cantidad = 3,
                Motivo = "Reposición"
            }
        });

        Assert.Equal(8, result.Stock);
        Assert.Equal(1, productoRepo.UpdateCount);
        Assert.Equal(1, productoRepo.SaveCount);
        var movimiento = Assert.Single(movimientoRepo.Movimientos);
        Assert.Equal(TipoMovimientoStock.Ingreso, movimiento.Tipo);
        Assert.Equal(5, movimiento.StockAnterior);
        Assert.Equal(8, movimiento.StockNuevo);
        Assert.Equal(7, movimiento.UsuarioId);
    }

    [Fact]
    public async Task Handle_SalidaQueDejaStockNegativo_LanzaError()
    {
        var productoRepo = new FakeProductoRepository();
        var movimientoRepo = new FakeMovimientoStockRepository();
        productoRepo.Productos.Add(new Producto { Id = 1, Nombre = "Coca", Stock = 2, Precio = 100, Activo = true });
        var handler = new AjustarStockProductoHandler(TestMapper.Create(), productoRepo, productoRepo, movimientoRepo, new FakeAuditoriaService(), NullLogger<AjustarStockProductoHandler>.Instance, new TestClock(DateTime.UtcNow));

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(new AjustarStockProductoCommand
        {
            ProductoId = 1,
            UsuarioId = 7,
            Movimiento = new AjustarStockProductoDto
            {
                Tipo = TipoMovimientoStock.Salida,
                Cantidad = 3,
                Motivo = "Merma"
            }
        }));

        Assert.Equal("El movimiento dejaría stock negativo.", exception.Message);
        Assert.Empty(movimientoRepo.Movimientos);
        Assert.Equal(0, productoRepo.UpdateCount);
    }
}
