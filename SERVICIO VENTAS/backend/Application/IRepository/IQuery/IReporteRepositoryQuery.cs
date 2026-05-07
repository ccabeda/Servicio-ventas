using ServicioVentas.Application.DTOs.Reportes;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IReporteRepositoryQuery
{
    Task<ResumenVentasDto> GetResumenVentasAsync(DateTime? fechaDesde, DateTime? fechaHasta);
    Task<List<VentaReporteDto>> GetVentasPorPeriodoAsync(DateTime? fechaDesde, DateTime? fechaHasta, int? cajaId, int? usuarioId, int? medioPagoId);
    Task<List<ProductoMasVendidoDto>> GetProductosMasVendidosAsync(DateTime? fechaDesde, DateTime? fechaHasta, int top);
}
