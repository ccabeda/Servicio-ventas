using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Command;

public class ClienteRepositoryCommand(ServicioVentasDbContext context) : IClienteRepositoryCommand
{
    public async Task AddAsync(Cliente cliente) => await context.Clientes.AddAsync(cliente);
    public Task UpdateAsync(Cliente cliente) { context.Clientes.Update(cliente); return Task.CompletedTask; }
    public async Task SaveChangesAsync() => await context.SaveChangesAsync();
}
