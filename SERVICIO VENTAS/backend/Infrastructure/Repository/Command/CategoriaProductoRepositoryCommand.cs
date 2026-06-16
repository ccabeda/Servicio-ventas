using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Command;

public class CategoriaProductoRepositoryCommand(ServicioVentasDbContext context) : ICategoriaProductoRepositoryCommand
{
    public async Task AddAsync(CategoriaProducto categoria) => await context.CategoriasProducto.AddAsync(categoria);
    public Task UpdateAsync(CategoriaProducto categoria) { context.CategoriasProducto.Update(categoria); return Task.CompletedTask; }
    public Task DeleteAsync(CategoriaProducto categoria)
    {
        categoria.Activo = false;
        context.CategoriasProducto.Update(categoria);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() => await context.SaveChangesAsync();
}
