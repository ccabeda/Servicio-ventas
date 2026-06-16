using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IImpresoraRepositoryQuery
{
    Task<List<Impresora>> GetAllAsync();
    Task<List<Impresora>> GetActivasAsync();
    Task<Impresora?> GetByIdAsync(int id);
    Task<Impresora?> GetPredeterminadaAsync();
    Task<bool> ExistsByNombreAsync(string nombre, int? excludeId = null);
    Task<bool> ExistsByNombreSistemaAsync(string nombreSistema, int? excludeId = null);
}
