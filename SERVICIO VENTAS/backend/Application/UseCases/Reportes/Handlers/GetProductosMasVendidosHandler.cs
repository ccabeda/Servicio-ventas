using ServicioVentas.Application.DTOs.Reportes;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Reportes.Queries;

namespace ServicioVentas.Application.UseCases.Reportes.Handlers;

public class GetProductosMasVendidosHandler(IReporteRepositoryQuery reporteRepositoryQuery) : IGetProductosMasVendidosHandler
{
    public async Task<List<ProductoMasVendidoDto>> Handle(GetProductosMasVendidosQuery query)
    {
        Validar(query);
        return await reporteRepositoryQuery.GetProductosMasVendidosAsync(query.FechaDesde, query.FechaHasta, query.UsuarioId, query.Top);
    }

    private static void Validar(GetProductosMasVendidosQuery query)
    {
        if (query.FechaDesde.HasValue && query.FechaHasta.HasValue && query.FechaDesde > query.FechaHasta)
            throw new InvalidOperationException("La fecha desde no puede ser mayor que la fecha hasta.");

        if (query.Top <= 0)
            throw new InvalidOperationException("El parametro top debe ser mayor que cero.");
    }
}
