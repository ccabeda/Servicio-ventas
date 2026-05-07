using ServicioVentas.Application.DTOs.Reportes;
using ServicioVentas.Application.UseCases.Reportes.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetResumenVentasHandler
{
    Task<ResumenVentasDto> Handle(GetResumenVentasQuery query);
}
