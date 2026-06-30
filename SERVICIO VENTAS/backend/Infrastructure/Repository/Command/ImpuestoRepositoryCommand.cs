using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Command;

public class ImpuestoRepositoryCommand(ServicioVentasDbContext context) : IImpuestoRepositoryCommand
{
    public async Task AddAsync(Impuesto impuesto) => await context.Impuestos.AddAsync(impuesto);
    public Task UpdateAsync(Impuesto impuesto) { context.Impuestos.Update(impuesto); return Task.CompletedTask; }
    public async Task SaveChangesAsync() => await context.SaveChangesAsync();
}
