using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.Services;
using ServicioVentas.Application.UseCases.Productos.Commands;

namespace ServicioVentas.Application.UseCases.Productos.Handlers;

public class DeleteProductoHandler(
    IProductoRepositoryCommand productoRepositoryCommand,
    IProductoRepositoryQuery productoRepositoryQuery,
    IClock clock) : IDeleteProductoHandler
{
    public async Task Handle(DeleteProductoCommand command)
    {
        var producto = await productoRepositoryQuery.GetByIdAsync(command.Id)
            ?? throw new KeyNotFoundException("Producto no encontrado.");

        if (producto.Stock > 0)
        {
            throw new InvalidOperationException("No se puede desactivar un producto con stock positivo. Ajusta el stock antes de desactivarlo.");
        }

        producto.Activo = false;
        producto.FechaActualizacion = clock.UtcNow;

        await productoRepositoryCommand.UpdateAsync(producto);
        await productoRepositoryCommand.SaveChangesAsync();
    }
}
