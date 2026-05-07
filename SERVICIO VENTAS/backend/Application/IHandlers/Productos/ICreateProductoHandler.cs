using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.UseCases.Productos.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface ICreateProductoHandler
{
    Task<ProductoDto> Handle(CreateProductoCommand command);
}
