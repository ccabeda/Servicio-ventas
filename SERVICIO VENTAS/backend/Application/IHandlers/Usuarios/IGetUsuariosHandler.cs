using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.DTOs.Usuarios;
using ServicioVentas.Application.UseCases.Usuarios.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetUsuariosHandler
{
    Task<List<UsuarioDto>> Handle(GetUsuariosQuery query);
    Task<PagedResultDto<UsuarioDto>> HandlePaged(GetUsuariosQuery query);
}
