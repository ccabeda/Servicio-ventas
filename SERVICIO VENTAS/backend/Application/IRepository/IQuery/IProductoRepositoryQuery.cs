using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IProductoRepositoryQuery
{
    Task<List<Producto>> GetAllAsync();
    Task<(List<Producto> Items, int TotalItems)> GetPagedAsync(int pageIndex, int pageSize, string? search, int? categoriaId, int? marcaId, string estado);
    Task<Producto?> GetByIdAsync(int id);
    Task<List<Producto>> GetByIdsAsync(List<int> ids);
    Task<bool> ExistsByCodigoBarraAsync(string codigoBarra, int? excludeId = null);
    Task<bool> ExistsByCodigoInternoAsync(string codigoInterno, int? excludeId = null);
}
