using ServicioVentas.Application.DTOs.Reportes;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Reportes.Queries;

namespace ServicioVentas.Application.UseCases.Reportes.Handlers;

public class GetResumenVentasHandler(IReporteRepositoryQuery reporteRepositoryQuery) : IGetResumenVentasHandler
{
    public async Task<ResumenVentasDto> Handle(GetResumenVentasQuery query)
    {
        ValidarRango(query.FechaDesde, query.FechaHasta);
        return await reporteRepositoryQuery.GetResumenVentasAsync(
            query.FechaDesde,
            query.FechaHasta,
            query.CajaId,
            query.UsuarioId,
            query.MedioPagoId,
            query.ClienteId,
            query.TotalMinimo,
            query.TotalMaximo);
    }

    private static void ValidarRango(DateTime? fechaDesde, DateTime? fechaHasta)
    {
        if (fechaDesde.HasValue && fechaHasta.HasValue && fechaDesde > fechaHasta)
            throw new InvalidOperationException("La fecha desde no puede ser mayor que la fecha hasta.");
    }
}
