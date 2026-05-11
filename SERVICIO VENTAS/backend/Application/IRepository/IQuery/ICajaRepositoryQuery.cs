using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface ICajaRepositoryQuery
{
    Task<Caja?> GetCajaAbiertaAsync();
    Task<Caja?> GetByIdAsync(int id);
    Task<List<Caja>> GetHistorialAsync(int? usuarioAperturaId = null);
    Task<List<MovimientoCaja>> GetMovimientosByCajaIdAsync(int cajaId);
    Task<decimal> GetSaldoSistemaByCajaIdAsync(int cajaId);
}
