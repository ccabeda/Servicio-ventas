using AutoMapper;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.DTOs.Usuarios;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Usuarios.Queries;

namespace ServicioVentas.Application.UseCases.Usuarios.Handlers;

public class GetUsuariosHandler(IMapper mapper, IUsuarioRepositoryQuery queryRepo) : IGetUsuariosHandler
{
    public async Task<List<UsuarioDto>> Handle(GetUsuariosQuery query) => mapper.Map<List<UsuarioDto>>(await queryRepo.GetAllAsync());

    public async Task<PagedResultDto<UsuarioDto>> HandlePaged(GetUsuariosQuery query)
    {
        var pageIndex = Math.Max(query.PageIndex ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 50);
        var (usuarios, totalItems) = await queryRepo.GetPagedAsync(pageIndex, pageSize, query.Search, query.Estado);

        return new PagedResultDto<UsuarioDto>
        {
            Items = mapper.Map<List<UsuarioDto>>(usuarios),
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalItems == 0 ? 0 : (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }
}
