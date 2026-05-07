using ServicioVentas.Application.DTOs.Usuarios;
using ServicioVentas.Application.UseCases.Usuarios.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetUsuarioByIdHandler
{
    Task<UsuarioDto> Handle(GetUsuarioByIdQuery query);
}
