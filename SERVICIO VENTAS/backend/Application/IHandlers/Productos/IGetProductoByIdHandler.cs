using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.UseCases.Productos.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetProductoByIdHandler
{
    Task<ProductoDto> Handle(GetProductoByIdQuery query);
}
