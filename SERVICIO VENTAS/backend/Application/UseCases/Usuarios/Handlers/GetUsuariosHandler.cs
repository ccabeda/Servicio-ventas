using AutoMapper;
using ServicioVentas.Application.DTOs.Usuarios;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Usuarios.Queries;

namespace ServicioVentas.Application.UseCases.Usuarios.Handlers;

public class GetUsuariosHandler(IMapper mapper, IUsuarioRepositoryQuery queryRepo) : IGetUsuariosHandler
{
    public async Task<List<UsuarioDto>> Handle(GetUsuariosQuery query) => mapper.Map<List<UsuarioDto>>(await queryRepo.GetAllAsync());
}
