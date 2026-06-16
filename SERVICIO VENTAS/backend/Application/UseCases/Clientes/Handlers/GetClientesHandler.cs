using AutoMapper;
using ServicioVentas.Application.DTOs.Clientes;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Clientes.Queries;

namespace ServicioVentas.Application.UseCases.Clientes.Handlers;

public class GetClientesHandler(IMapper mapper, IClienteRepositoryQuery queryRepo) : IGetClientesHandler
{
    public async Task<List<ClienteDto>> Handle(GetClientesQuery query) => mapper.Map<List<ClienteDto>>(await queryRepo.GetAllAsync());

    public async Task<PagedResultDto<ClienteDto>> HandlePaged(GetClientesQuery query)
    {
        var pageIndex = Math.Max(query.PageIndex ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 50);
        var (clientes, totalItems) = await queryRepo.GetPagedAsync(pageIndex, pageSize, query.Search, query.Estado);

        return new PagedResultDto<ClienteDto>
        {
            Items = mapper.Map<List<ClienteDto>>(clientes),
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalItems == 0 ? 0 : (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }
}
