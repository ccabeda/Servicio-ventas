using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IUsuarioRepositoryQuery
{
    Task<List<Usuario>> GetAllAsync();
    Task<Usuario?> GetByIdAsync(int id);
    Task<Usuario?> GetByNombreUsuarioAsync(string nombreUsuario);
    Task<bool> ExistsByNombreUsuarioAsync(string nombreUsuario, int? excludeId = null);
}
