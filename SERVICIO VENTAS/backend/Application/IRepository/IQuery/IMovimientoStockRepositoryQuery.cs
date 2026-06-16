using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IMovimientoStockRepositoryQuery
{
    Task<List<MovimientoStock>> GetByProductoIdAsync(int productoId, int take);
    Task<(List<MovimientoStock> Items, int TotalItems)> GetByProductoIdPagedAsync(int productoId, int pageIndex, int pageSize);
}
