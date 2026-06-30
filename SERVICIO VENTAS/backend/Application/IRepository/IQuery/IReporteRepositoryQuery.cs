using ServicioVentas.Application.DTOs.Reportes;
using ServicioVentas.Application.DTOs.Common;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IReporteRepositoryQuery
{
    Task<ResumenVentasDto> GetResumenVentasAsync(DateTime? fechaDesde, DateTime? fechaHasta, int? cajaId, int? usuarioId, int? medioPagoId, int? clienteId, decimal? totalMinimo, decimal? totalMaximo);
    Task<List<VentaReporteDto>> GetVentasPorPeriodoAsync(DateTime? fechaDesde, DateTime? fechaHasta, int? cajaId, int? usuarioId, int? medioPagoId, int? clienteId, decimal? totalMinimo, decimal? totalMaximo);
    Task<PagedResultDto<VentaReporteDto>> GetVentasPorPeriodoPagedAsync(DateTime? fechaDesde, DateTime? fechaHasta, int? cajaId, int? usuarioId, int? medioPagoId, int? clienteId, decimal? totalMinimo, decimal? totalMaximo, int pageIndex, int pageSize);
    Task<List<ProductoMasVendidoDto>> GetProductosMasVendidosAsync(DateTime? fechaDesde, DateTime? fechaHasta, int? cajaId, int? usuarioId, int? medioPagoId, int? clienteId, decimal? totalMinimo, decimal? totalMaximo, int top);
}
