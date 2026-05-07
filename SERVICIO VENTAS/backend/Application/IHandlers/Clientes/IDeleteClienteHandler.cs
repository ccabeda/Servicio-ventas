using ServicioVentas.Application.UseCases.Clientes.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface IDeleteClienteHandler
{
    Task Handle(DeleteClienteCommand command);
}
