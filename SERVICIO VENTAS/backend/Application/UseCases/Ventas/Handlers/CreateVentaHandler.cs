using AutoMapper;
using ServicioVentas.Application.DTOs.Ventas;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
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
    IMedioPagoRepositoryQuery medioPagoQueryRepo,
    IClienteRepositoryQuery clienteQueryRepo,
    ServicioVentas.Application.IUnitOfWork.IUnitOfWork unitOfWork) : ICreateVentaHandler
{
    public async Task<VentaDto> Handle(CreateVentaCommand command)
    {
        var request = command.Venta;

        var cajaAbierta = await cajaQueryRepo.GetCajaAbiertaAsync();
        if (cajaAbierta is null)
            throw new InvalidOperationException("No se puede vender sin caja abierta.");

        var medioPago = await medioPagoQueryRepo.GetByIdAsync(request.MedioPagoId);
        if (medioPago is null || !medioPago.Activo)
            throw new InvalidOperationException("El medio de pago no es valido.");

        if (request.ClienteId.HasValue)
        {
            var cliente = await clienteQueryRepo.GetByIdAsync(request.ClienteId.Value);
            if (cliente is null || !cliente.Activo)
                throw new InvalidOperationException("El cliente no es valido.");
        }

        var items = request.Detalles
            .GroupBy(x => x.ProductoId)
            .Select(g => new { ProductoId = g.Key, Cantidad = g.Sum(x => x.Cantidad) })
            .ToList();

        var productos = await productoQueryRepo.GetByIdsAsync(items.Select(x => x.ProductoId).ToList());
        if (productos.Count != items.Count)
            throw new InvalidOperationException("Uno o mas productos no existen.");

        var productosPorId = productos.ToDictionary(x => x.Id);

        var detalles = new List<VentaDetalle>();
        decimal subtotal = 0;

        foreach (var item in items)
        {
            var producto = productosPorId[item.ProductoId];
            if (!producto.Activo)
                throw new InvalidOperationException($"El producto {producto.Nombre} esta inactivo.");
            if (producto.Stock < item.Cantidad)
                throw new InvalidOperationException($"Stock insuficiente para el producto {producto.Nombre}.");

            var itemSubtotal = producto.Precio * item.Cantidad;
            subtotal += itemSubtotal;

            detalles.Add(new VentaDetalle
            {
                ProductoId = producto.Id,
                Producto = producto,
                Cantidad = item.Cantidad,
                PrecioUnitario = producto.Precio,
                Subtotal = itemSubtotal
            });

            producto.Stock -= item.Cantidad;
            producto.FechaActualizacion = DateTime.UtcNow;
            await productoCommandRepo.UpdateAsync(producto);
        }

        var total = subtotal - request.Descuento + request.Recargo;
        if (total < 0)
            throw new InvalidOperationException("El total de la venta no puede ser negativo.");

        var venta = new Venta
        {
            Fecha = DateTime.UtcNow,
            Subtotal = subtotal,
            Descuento = request.Descuento,
            Recargo = request.Recargo,
            Total = total,
            Estado = EstadoVenta.Confirmada,
            Observaciones = string.IsNullOrWhiteSpace(request.Observaciones) ? null : request.Observaciones.Trim(),
            MedioPagoId = request.MedioPagoId,
            CajaId = cajaAbierta.Id,
            UsuarioId = request.UsuarioId,
            ClienteId = request.ClienteId,
            Detalles = detalles
        };

        await ventaCommandRepo.AddAsync(venta);
        await ventaCommandRepo.AddMovimientoAsync(new MovimientoCaja
        {
            CajaId = cajaAbierta.Id,
            Fecha = DateTime.UtcNow,
            Tipo = TipoMovimientoCaja.Venta,
            Concepto = "Venta",
            Monto = total,
            UsuarioId = request.UsuarioId
        });
        await unitOfWork.SaveChangesAsync();

        return mapper.Map<VentaDto>(venta);
    }
}
