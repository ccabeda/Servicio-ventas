using System.Text.Json;
using AutoMapper;
using Microsoft.Extensions.Logging;
using ServicioVentas.Application.DTOs.Auditoria;
using ServicioVentas.Application.DTOs.Ventas;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.Services;
using ServicioVentas.Application.UseCases.Ventas.Commands;
using ServicioVentas.Domain.Enums;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Ventas.Handlers;

public class CreateVentaHandler(
    IMapper mapper,
    IVentaRepositoryCommand ventaCommandRepo,
    ICajaRepositoryQuery cajaQueryRepo,
    IProductoRepositoryQuery productoQueryRepo,
    IProductoRepositoryCommand productoCommandRepo,
    IMovimientoStockRepositoryCommand movimientoStockCommandRepo,
    IMedioPagoRepositoryQuery medioPagoQueryRepo,
    IImpuestoRepositoryQuery impuestoQueryRepo,
    IClienteRepositoryQuery clienteQueryRepo,
    IConfiguracionNegocioRepositoryQuery configuracionQueryRepo,
    IClock clock,
    IAuditoriaService auditoriaService,
    ILogger<CreateVentaHandler> logger,
    ServicioVentas.Application.IUnitOfWork.IUnitOfWork unitOfWork) : ICreateVentaHandler
{
    private static readonly Action<ILogger, int, int, decimal, int, Exception?> VentaCreada =
        LoggerMessage.Define<int, int, decimal, int>(
            LogLevel.Information,
            new EventId(4001, nameof(VentaCreada)),
            "Venta creada por usuario {UsuarioId} en caja {CajaId}. Total {Total}. Items {Items}.");

    public async Task<VentaDto> Handle(CreateVentaCommand command)
    {
        var request = command.Venta;
        var usuarioId = command.UsuarioId;

        var cajaAbierta = await cajaQueryRepo.GetCajaAbiertaAsync();
        if (cajaAbierta is null)
            throw new InvalidOperationException("No se puede vender sin caja abierta.");

        var configuracion = await configuracionQueryRepo.GetPrincipalAsync();
        var descuentoMaximo = configuracion?.DescuentoMaximoPermitido ?? 20m;
        if (request.Descuento > descuentoMaximo)
            throw new InvalidOperationException($"El descuento no puede superar el {descuentoMaximo:0.##}%.");

        var medioPago = await medioPagoQueryRepo.GetByIdAsync(request.MedioPagoId);
        if (medioPago is null || !medioPago.Activo)
            throw new InvalidOperationException("El medio de pago no es válido.");

        if (request.ClienteId.HasValue)
        {
            var cliente = await clienteQueryRepo.GetByIdAsync(request.ClienteId.Value);
            if (cliente is null || !cliente.Activo)
                throw new InvalidOperationException("El cliente no es válido.");
        }

        var items = request.Detalles
            .GroupBy(x => x.ProductoId)
            .Select(g => new { ProductoId = g.Key, Cantidad = g.Sum(x => x.Cantidad) })
            .ToList();

        if (items.Any(x => decimal.Truncate(x.Cantidad) != x.Cantidad))
            throw new InvalidOperationException("Las cantidades vendidas deben ser números enteros.");

        var productos = await productoQueryRepo.GetByIdsAsync(items.Select(x => x.ProductoId).ToList());
        if (productos.Count != items.Count)
            throw new InvalidOperationException("Uno o más productos no existen.");

        var productosPorId = productos.ToDictionary(x => x.Id);
        var aplicarImpuestos = configuracion?.AplicarImpuestosEnVentas != false;
        var impuestoPredeterminado = aplicarImpuestos ? await impuestoQueryRepo.GetPredeterminadoAsync() : null;

        var detalles = new List<VentaDetalle>();
        decimal subtotal = 0;

        foreach (var item in items)
        {
            var producto = productosPorId[item.ProductoId];
            if (!producto.Activo)
                throw new InvalidOperationException($"El producto {producto.Nombre} está inactivo.");
            if (producto.Stock < item.Cantidad)
                throw new InvalidOperationException($"Stock insuficiente para el producto {producto.Nombre}.");

            var itemSubtotal = producto.Precio * item.Cantidad;
            var impuesto = aplicarImpuestos ? ResolveImpuesto(producto, impuestoPredeterminado) : null;
            var importeNeto = CalculateImporteNeto(itemSubtotal, impuesto?.Porcentaje ?? 0m);
            var importeImpuesto = itemSubtotal - importeNeto;
            subtotal += itemSubtotal;

            detalles.Add(new VentaDetalle
            {
                ProductoId = producto.Id,
                Producto = producto,
                Cantidad = item.Cantidad,
                PrecioUnitario = producto.Precio,
                Subtotal = itemSubtotal,
                ImpuestoId = impuesto?.Id,
                ImpuestoNombre = impuesto?.Nombre ?? "Sin impuesto",
                ImpuestoPorcentaje = impuesto?.Porcentaje ?? 0m,
                ImporteNeto = importeNeto,
                ImporteImpuesto = importeImpuesto
            });

            producto.Stock -= item.Cantidad;
            producto.FechaActualizacion = clock.UtcNow;
            await movimientoStockCommandRepo.AddAsync(new MovimientoStock
            {
                ProductoId = producto.Id,
                Tipo = TipoMovimientoStock.Venta,
                Cantidad = item.Cantidad,
                StockAnterior = producto.Stock + item.Cantidad,
                StockNuevo = producto.Stock,
                Motivo = "Venta",
                UsuarioId = usuarioId,
                Fecha = clock.UtcNow
            });
            await productoCommandRepo.UpdateAsync(producto);
        }

        var descuentoMonto = subtotal * request.Descuento / 100m;
        var total = ApplyRedondeo(subtotal - descuentoMonto + request.Recargo, configuracion?.RedondeoTotal);
        if (total < 0)
            throw new InvalidOperationException("El total de la venta no puede ser negativo.");

        var venta = new Venta
        {
            Fecha = clock.UtcNow,
            Subtotal = subtotal,
            Descuento = request.Descuento,
            Recargo = request.Recargo,
            Total = total,
            Estado = EstadoVenta.Confirmada,
            Observaciones = string.IsNullOrWhiteSpace(request.Observaciones) ? null : request.Observaciones.Trim(),
            MedioPagoId = request.MedioPagoId,
            CajaId = cajaAbierta.Id,
            UsuarioId = usuarioId,
            ClienteId = request.ClienteId,
            Detalles = detalles
        };

        await ventaCommandRepo.AddAsync(venta);
        await ventaCommandRepo.AddMovimientoAsync(new MovimientoCaja
        {
            CajaId = cajaAbierta.Id,
            Fecha = clock.UtcNow,
            Tipo = TipoMovimientoCaja.Venta,
            Concepto = "Venta",
            Monto = total,
            UsuarioId = usuarioId
        });
        await auditoriaService.RegistrarAsync(new RegistrarAuditoriaEventoDto
        {
            UsuarioId = usuarioId,
            Modulo = "Ventas",
            Accion = "Crear",
            Entidad = "Venta",
            Detalle = $"Venta confirmada por {total:0.##} con {detalles.Count} productos.",
            ValoresNuevosJson = JsonSerializer.Serialize(new
            {
                subtotal,
                descuento = request.Descuento,
                recargo = request.Recargo,
                total,
                cajaId = cajaAbierta.Id,
                medioPagoId = request.MedioPagoId,
                clienteId = request.ClienteId
            })
        });
        await unitOfWork.SaveChangesAsync();
        VentaCreada(logger, usuarioId, cajaAbierta.Id, total, detalles.Count, null);

        return mapper.Map<VentaDto>(venta);
    }

    private static decimal ApplyRedondeo(decimal total, string? redondeo)
    {
        var step = redondeo switch
        {
            "0.05" => 0.05m,
            "1.00" => 1m,
            _ => 0m
        };

        return step <= 0 ? Math.Round(total, 2) : Math.Round(Math.Round(total / step, 0, MidpointRounding.AwayFromZero) * step, 2);
    }

    private static Impuesto? ResolveImpuesto(Producto producto, Impuesto? predeterminado)
    {
        return producto.Impuesto?.Activo == true
            ? producto.Impuesto
            : producto.Categoria?.Impuesto?.Activo == true
                ? producto.Categoria.Impuesto
                : predeterminado?.Activo == true
                    ? predeterminado
                    : null;
    }

    private static decimal CalculateImporteNeto(decimal importeFinal, decimal porcentaje)
    {
        if (porcentaje <= 0)
        {
            return Math.Round(importeFinal, 2);
        }

        return Math.Round(importeFinal / (1 + porcentaje / 100m), 2);
    }
}
