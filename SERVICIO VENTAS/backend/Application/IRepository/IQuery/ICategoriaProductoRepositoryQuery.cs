using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface ICategoriaProductoRepositoryQuery
{
    Task<List<CategoriaProducto>> GetAllAsync();
    Task<CategoriaProducto?> GetByIdAsync(int id);
    Task<CategoriaProducto?> GetByNombreAsync(string nombre);
    Task<bool> ExistsByNombreAsync(string nombre, int? excludeId = null);
    Task<bool> ExistsAsync(int id);
}
