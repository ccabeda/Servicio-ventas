using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.UseCases.Productos.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface IUpdateProductoHandler
{
    Task<ProductoDto> Handle(UpdateProductoCommand command);
}
