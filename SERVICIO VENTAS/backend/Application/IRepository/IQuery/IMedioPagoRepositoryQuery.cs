using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IMedioPagoRepositoryQuery
{
    Task<List<MedioPago>> GetAllAsync();
    Task<MedioPago?> GetByIdAsync(int id);
    Task<MedioPago?> GetByNombreAsync(string nombre);
    Task<bool> ExistsByNombreAsync(string nombre, int? excludeId = null);
}
