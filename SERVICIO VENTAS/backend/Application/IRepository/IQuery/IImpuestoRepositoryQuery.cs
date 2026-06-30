using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IImpuestoRepositoryQuery
{
    Task<List<Impuesto>> GetAllAsync();
    Task<(List<Impuesto> Items, int TotalItems)> GetPagedAsync(int pageIndex, int pageSize, string? search, string estado);
    Task<Impuesto?> GetByIdAsync(int id);
    Task<Impuesto?> GetByNombreAsync(string nombre);
    Task<Impuesto?> GetPredeterminadoAsync();
    Task<bool> ExistsByNombreAsync(string nombre, int? excludeId = null);
    Task<int> CountActivosAsync();
    Task<int> CountProductosSinTasaAsync();
}
