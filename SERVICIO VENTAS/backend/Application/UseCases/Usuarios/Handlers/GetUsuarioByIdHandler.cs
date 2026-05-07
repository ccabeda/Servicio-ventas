using AutoMapper;
using ServicioVentas.Application.DTOs.Usuarios;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Usuarios.Queries;

namespace ServicioVentas.Application.UseCases.Usuarios.Handlers;

public class GetUsuarioByIdHandler(IMapper mapper, IUsuarioRepositoryQuery queryRepo) : IGetUsuarioByIdHandler
{
    public async Task<UsuarioDto> Handle(GetUsuarioByIdQuery query) => mapper.Map<UsuarioDto>(await queryRepo.GetByIdAsync(query.Id) ?? throw new KeyNotFoundException("Usuario no encontrado."));
}
