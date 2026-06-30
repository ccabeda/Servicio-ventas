using ServicioVentas.Application.DTOs.Reportes;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Reportes.Queries;

namespace ServicioVentas.Application.UseCases.Reportes.Handlers;

public class GetVentasPorPeriodoHandler(IReporteRepositoryQuery reporteRepositoryQuery) : IGetVentasPorPeriodoHandler
{
    public async Task<List<VentaReporteDto>> Handle(GetVentasPorPeriodoQuery query)
    {
        ValidarRango(query.FechaDesde, query.FechaHasta);
        return await reporteRepositoryQuery.GetVentasPorPeriodoAsync(
            query.FechaDesde,
            query.FechaHasta,
            query.CajaId,
            query.UsuarioId,
            query.MedioPagoId,
            query.ClienteId,
            query.TotalMinimo,
            query.TotalMaximo);
    }

    public async Task<PagedResultDto<VentaReporteDto>> HandlePaged(GetVentasPorPeriodoQuery query)
    {
        ValidarRango(query.FechaDesde, query.FechaHasta);
        return await reporteRepositoryQuery.GetVentasPorPeriodoPagedAsync(
            query.FechaDesde,
            query.FechaHasta,
            query.CajaId,
            query.UsuarioId,
            query.MedioPagoId,
            query.ClienteId,
            query.TotalMinimo,
            query.TotalMaximo,
            query.PageIndex,
            query.PageSize);
    }

    private static void ValidarRango(DateTime? fechaDesde, DateTime? fechaHasta)
    {
        if (fechaDesde.HasValue && fechaHasta.HasValue && fechaDesde > fechaHasta)
            throw new InvalidOperationException("La fecha desde no puede ser mayor que la fecha hasta.");
    }
}
