using ServicioVentas.Application.DTOs.Reportes;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.UseCases.Reportes.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetVentasPorPeriodoHandler
{
    Task<List<VentaReporteDto>> Handle(GetVentasPorPeriodoQuery query);
    Task<PagedResultDto<VentaReporteDto>> HandlePaged(GetVentasPorPeriodoQuery query);
}
