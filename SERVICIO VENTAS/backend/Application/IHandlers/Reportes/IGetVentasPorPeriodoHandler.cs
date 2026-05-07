using ServicioVentas.Application.DTOs.Reportes;
using ServicioVentas.Application.UseCases.Reportes.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetVentasPorPeriodoHandler
{
    Task<List<VentaReporteDto>> Handle(GetVentasPorPeriodoQuery query);
}
