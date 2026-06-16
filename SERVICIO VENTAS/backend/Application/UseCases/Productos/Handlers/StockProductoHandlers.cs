using AutoMapper;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using ServicioVentas.Application.DTOs.Auditoria;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.Services;
using ServicioVentas.Application.UseCases.Productos.Commands;
using ServicioVentas.Application.UseCases.Productos.Queries;
using ServicioVentas.Domain.Enums;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Productos.Handlers;

public class AjustarStockProductoHandler(
    IMapper mapper,
    IProductoRepositoryCommand productoCommandRepo,
    IProductoRepositoryQuery productoQueryRepo,
    IMovimientoStockRepositoryCommand movimientoStockCommandRepo,
    IAuditoriaService auditoriaService,
    ILogger<AjustarStockProductoHandler> logger,
    IClock clock) : IAjustarStockProductoHandler
{
    public async Task<ProductoDto> Handle(AjustarStockProductoCommand command)
    {
        var producto = await productoQueryRepo.GetByIdAsync(command.ProductoId)
            ?? throw new KeyNotFoundException("Producto no encontrado.");
        var request = command.Movimiento;

        if (request.Tipo is TipoMovimientoStock.Venta)
        {
            throw new InvalidOperationException("La venta se registra automáticamente desde el punto de venta.");
        }

        if (request.Cantidad < 0)
        {
            throw new InvalidOperationException("La cantidad no puede ser negativa.");
        }

        if (decimal.Truncate(request.Cantidad) != request.Cantidad)
        {
            throw new InvalidOperationException("La cantidad debe ser un número entero.");
        }

        var stockAnterior = producto.Stock;
        var stockNuevo = request.Tipo switch
        {
            TipoMovimientoStock.Ingreso => stockAnterior + request.Cantidad,
            TipoMovimientoStock.Salida => stockAnterior - request.Cantidad,
            TipoMovimientoStock.Ajuste => request.Cantidad,
            _ => throw new InvalidOperationException("El tipo de movimiento no es válido.")
        };

        if (request.Tipo is not TipoMovimientoStock.Ajuste && request.Cantidad <= 0)
        {
            throw new InvalidOperationException("La cantidad debe ser mayor a cero.");
        }

        if (stockNuevo < 0)
        {
            throw new InvalidOperationException("El movimiento dejaría stock negativo.");
        }

        var motivo = string.IsNullOrWhiteSpace(request.Motivo) ? "Ajuste de stock" : request.Motivo.Trim();
        producto.Stock = stockNuevo;
        producto.FechaActualizacion = clock.UtcNow;

        await movimientoStockCommandRepo.AddAsync(new MovimientoStock
        {
            ProductoId = producto.Id,
            Tipo = request.Tipo,
            Cantidad = request.Tipo is TipoMovimientoStock.Ajuste ? Math.Abs(stockNuevo - stockAnterior) : request.Cantidad,
            StockAnterior = stockAnterior,
            StockNuevo = stockNuevo,
            Motivo = motivo,
            Observacion = string.IsNullOrWhiteSpace(request.Observacion) ? null : request.Observacion.Trim(),
            UsuarioId = command.UsuarioId,
            Fecha = clock.UtcNow
        });

        await auditoriaService.RegistrarAsync(new RegistrarAuditoriaEventoDto
        {
            UsuarioId = command.UsuarioId,
            Modulo = "Stock",
            Accion = request.Tipo.ToString(),
            Entidad = "Producto",
            EntidadId = producto.Id.ToString(),
            Detalle = $"Stock de {producto.Nombre}: {stockAnterior:0.##} -> {stockNuevo:0.##}.",
            ValoresAnterioresJson = JsonSerializer.Serialize(new { stock = stockAnterior }),
            ValoresNuevosJson = JsonSerializer.Serialize(new { stock = stockNuevo, motivo })
        });
        await productoCommandRepo.UpdateAsync(producto);
        await productoCommandRepo.SaveChangesAsync();
        logger.LogInformation(
            "Stock ajustado para producto {ProductoId} por usuario {UsuarioId}. Tipo {Tipo}. Stock {StockAnterior} -> {StockNuevo}.",
            producto.Id,
            command.UsuarioId,
            request.Tipo,
            stockAnterior,
            stockNuevo);

        return mapper.Map<ProductoDto>(producto);
    }
}

public class GetMovimientosStockProductoHandler(
    IMapper mapper,
    IMovimientoStockRepositoryQuery movimientoStockQueryRepo) : IGetMovimientosStockProductoHandler
{
    public async Task<List<MovimientoStockDto>> Handle(GetMovimientosStockProductoQuery query)
    {
        var movimientos = await movimientoStockQueryRepo.GetByProductoIdAsync(query.ProductoId, query.Take);
        return mapper.Map<List<MovimientoStockDto>>(movimientos);
    }

    public async Task<PagedResultDto<MovimientoStockDto>> HandlePaged(GetMovimientosStockProductoQuery query)
    {
        var pageIndex = Math.Max(query.PageIndex ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 50);
        var (movimientos, totalItems) = await movimientoStockQueryRepo.GetByProductoIdPagedAsync(query.ProductoId, pageIndex, pageSize);

        return new PagedResultDto<MovimientoStockDto>
        {
            Items = mapper.Map<List<MovimientoStockDto>>(movimientos),
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalItems == 0 ? 0 : (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }
}
