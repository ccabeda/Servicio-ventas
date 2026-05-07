using ServicioVentas.Application.UseCases.Productos.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface IDeleteProductoHandler
{
    Task Handle(DeleteProductoCommand command);
}
