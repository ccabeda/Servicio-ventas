using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Command;

public class ConfiguracionNegocioRepositoryCommand(ServicioVentasDbContext context) : IConfiguracionNegocioRepositoryCommand
{
    public async Task AddAsync(ConfiguracionNegocio configuracion) => await context.ConfiguracionesNegocio.AddAsync(configuracion);
    public Task UpdateAsync(ConfiguracionNegocio configuracion) { context.ConfiguracionesNegocio.Update(configuracion); return Task.CompletedTask; }
    public async Task SaveChangesAsync() => await context.SaveChangesAsync();
}
