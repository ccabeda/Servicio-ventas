using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Productos.Commands;

namespace ServicioVentas.Application.UseCases.Productos.Handlers;

public class DeleteProductoHandler(
    IProductoRepositoryCommand productoRepositoryCommand,
    IProductoRepositoryQuery productoRepositoryQuery) : IDeleteProductoHandler
{
    public async Task Handle(DeleteProductoCommand command)
    {
        var producto = await productoRepositoryQuery.GetByIdAsync(command.Id)
            ?? throw new KeyNotFoundException("Producto no encontrado.");

        producto.Activo = false;
        producto.FechaActualizacion = DateTime.UtcNow;

        await productoRepositoryCommand.UpdateAsync(producto);
        await productoRepositoryCommand.SaveChangesAsync();
    }
}
