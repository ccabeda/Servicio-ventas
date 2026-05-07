using ServicioVentas.Application.DTOs.Ventas;
using ServicioVentas.Application.UseCases.Ventas.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetVentasHandler
{
    Task<List<VentaDto>> Handle(GetVentasQuery query);
}
