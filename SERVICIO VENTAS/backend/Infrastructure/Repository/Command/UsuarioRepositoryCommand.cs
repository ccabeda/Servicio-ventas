using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Command;

public class UsuarioRepositoryCommand(ServicioVentasDbContext context) : IUsuarioRepositoryCommand
{
    public async Task AddAsync(Usuario usuario) => await context.Usuarios.AddAsync(usuario);
    public Task UpdateAsync(Usuario usuario) { context.Usuarios.Update(usuario); return Task.CompletedTask; }
    public async Task SaveChangesAsync() => await context.SaveChangesAsync();
}
