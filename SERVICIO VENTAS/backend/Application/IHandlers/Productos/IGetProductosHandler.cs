using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.UseCases.Productos.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetProductosHandler
{
    Task<List<ProductoDto>> Handle(GetProductosQuery query);
}
