using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.IRepository.ICommand;

public interface IConfiguracionNegocioRepositoryCommand
{
    Task AddAsync(ConfiguracionNegocio configuracion);
    Task UpdateAsync(ConfiguracionNegocio configuracion);
    Task SaveChangesAsync();
}
