using AutoMapper;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.DTOs.Ventas;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Ventas.Queries;

namespace ServicioVentas.Application.UseCases.Ventas.Handlers;

public class GetVentasHandler(IMapper mapper, IVentaRepositoryQuery queryRepo) : IGetVentasHandler
{
    public async Task<List<VentaDto>> Handle(GetVentasQuery query)
    {
        var ventas = query.UsuarioId.HasValue
            ? await queryRepo.GetByUsuarioAsync(query.UsuarioId.Value)
            : await queryRepo.GetAllAsync();

        return mapper.Map<List<VentaDto>>(ventas);
    }

    public async Task<PagedResultDto<VentaDto>> HandlePaged(GetVentasQuery query)
    {
        var pageIndex = Math.Max(query.PageIndex ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 50);
        var (ventas, totalItems) = await queryRepo.GetPagedAsync(pageIndex, pageSize, query.UsuarioId);

        return new PagedResultDto<VentaDto>
        {
            Items = mapper.Map<List<VentaDto>>(ventas),
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalItems == 0 ? 0 : (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }
}
