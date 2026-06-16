using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Command;

public class ImpresoraRepositoryCommand(ServicioVentasDbContext context) : IImpresoraRepositoryCommand
{
    public async Task AddAsync(Impresora impresora) => await context.Impresoras.AddAsync(impresora);
    public Task UpdateAsync(Impresora impresora)
    {
        context.Impresoras.Update(impresora);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() => await context.SaveChangesAsync();
}
