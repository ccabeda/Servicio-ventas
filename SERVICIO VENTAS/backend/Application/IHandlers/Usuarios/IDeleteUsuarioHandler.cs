using ServicioVentas.Application.UseCases.Usuarios.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface IDeleteUsuarioHandler
{
    Task Handle(DeleteUsuarioCommand command);
}
