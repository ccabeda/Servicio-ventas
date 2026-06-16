using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IMedioPagoRepositoryQuery
{
    Task<List<MedioPago>> GetAllAsync();
    Task<(List<MedioPago> Items, int TotalItems)> GetPagedAsync(int pageIndex, int pageSize, string? search, string estado);
    Task<MedioPago?> GetByIdAsync(int id);
    Task<MedioPago?> GetByNombreAsync(string nombre);
    Task<bool> ExistsByNombreAsync(string nombre, int? excludeId = null);
    Task<int> CountActivosAsync();
}
