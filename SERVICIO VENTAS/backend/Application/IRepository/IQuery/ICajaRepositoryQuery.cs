using ServicioVentas.Domain.Models;
using ServicioVentas.Application.DTOs.Cajas;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface ICajaRepositoryQuery
{
    Task<Caja?> GetCajaAbiertaAsync();
    Task<Caja?> GetByIdAsync(int id);
    Task<List<Caja>> GetHistorialAsync(int? usuarioAperturaId = null);
    Task<(List<Caja> Items, int TotalItems)> GetHistorialPagedAsync(int pageIndex, int pageSize, int? usuarioAperturaId = null);
    Task<List<MovimientoCaja>> GetMovimientosByCajaIdAsync(int cajaId);
    Task<(List<MovimientoCaja> Items, int TotalItems)> GetMovimientosByCajaIdPagedAsync(int cajaId, int pageIndex, int pageSize);
    Task<decimal> GetSaldoSistemaByCajaIdAsync(int cajaId);
    Task<List<CajaMedioPagoResumenDto>> GetVentasPorMedioPagoByCajaIdAsync(int cajaId);
}
