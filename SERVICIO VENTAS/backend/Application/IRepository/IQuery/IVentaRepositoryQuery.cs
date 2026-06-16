using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IVentaRepositoryQuery
{
    Task<List<Venta>> GetAllAsync();
    Task<List<Venta>> GetByUsuarioAsync(int usuarioId);
    Task<(List<Venta> Items, int TotalItems)> GetPagedAsync(int pageIndex, int pageSize, int? usuarioId = null);
    Task<Venta?> GetByIdAsync(int id);
}
