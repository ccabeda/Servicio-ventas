using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.IQuery;

public interface IConfiguracionNegocioRepositoryQuery
{
    Task<List<ConfiguracionNegocio>> GetAllAsync();
    Task<ConfiguracionNegocio?> GetByIdAsync(int id);
}
