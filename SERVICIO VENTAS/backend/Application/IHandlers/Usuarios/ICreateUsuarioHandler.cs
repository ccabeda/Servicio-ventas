using ServicioVentas.Application.DTOs.Usuarios;
using ServicioVentas.Application.UseCases.Usuarios.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface ICreateUsuarioHandler
{
    Task<UsuarioDto> Handle(CreateUsuarioCommand command);
}
