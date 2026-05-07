using ServicioVentas.Application.DTOs.Usuarios;
using ServicioVentas.Application.UseCases.Usuarios.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface IUpdateUsuarioHandler
{
    Task<UsuarioDto> Handle(UpdateUsuarioCommand command);
}
