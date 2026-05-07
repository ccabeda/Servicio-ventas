using ServicioVentas.Application.DTOs.Reportes;
using ServicioVentas.Application.UseCases.Reportes.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetProductosMasVendidosHandler
{
    Task<List<ProductoMasVendidoDto>> Handle(GetProductosMasVendidosQuery query);
}
