using AutoMapper;
using ServicioVentas.Application.DTOs.Auditoria;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Auditoria.Queries;

namespace ServicioVentas.Application.UseCases.Auditoria.Handlers;

public class GetAuditoriaEventosHandler(IMapper mapper, IAuditoriaEventoRepositoryQuery queryRepo) : IGetAuditoriaEventosHandler
{
    public async Task<PagedResultDto<AuditoriaEventoDto>> HandlePaged(GetAuditoriaEventosQuery query)
    {
        var pageIndex = Math.Max(query.PageIndex ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 100);
        var (eventos, totalItems) = await queryRepo.GetPagedAsync(
            pageIndex,
            pageSize,
            query.FechaDesde,
            query.FechaHasta,
            query.UsuarioId,
            query.Modulo,
            query.Accion,
            query.Search);

        return new PagedResultDto<AuditoriaEventoDto>
        {
            Items = mapper.Map<List<AuditoriaEventoDto>>(eventos),
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalItems == 0 ? 0 : (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }
}

public class GetAuditoriaEventoByIdHandler(IMapper mapper, IAuditoriaEventoRepositoryQuery queryRepo) : IGetAuditoriaEventoByIdHandler
{
    public async Task<AuditoriaEventoDto> Handle(GetAuditoriaEventoByIdQuery query)
    {
        var evento = await queryRepo.GetByIdAsync(query.Id)
            ?? throw new KeyNotFoundException("Evento de auditoría no encontrado.");

        return mapper.Map<AuditoriaEventoDto>(evento);
    }
}
