using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IMarcaProductoRepositoryQuery
{
    Task<List<MarcaProducto>> GetAllAsync();
    Task<MarcaProducto?> GetByIdAsync(int id);
    Task<MarcaProducto?> GetByNombreAsync(string nombre);
    Task<bool> ExistsByNombreAsync(string nombre, int? excludeId = null);
    Task<bool> ExistsActiveAsync(int id);
}
