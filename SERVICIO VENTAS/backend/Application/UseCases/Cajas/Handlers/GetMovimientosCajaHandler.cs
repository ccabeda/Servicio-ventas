using AutoMapper;
using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Cajas.Queries;

namespace ServicioVentas.Application.UseCases.Cajas.Handlers;

public class GetMovimientosCajaHandler(IMapper mapper, ICajaRepositoryQuery cajaRepositoryQuery) : IGetMovimientosCajaHandler
{
    public async Task<List<MovimientoCajaDto>> Handle(GetMovimientosCajaQuery query)
    {
        var caja = await cajaRepositoryQuery.GetByIdAsync(query.CajaId)
            ?? throw new KeyNotFoundException("Caja no encontrada.");

        if (!query.EsAdmin && caja.UsuarioAperturaId != query.UsuarioId)
            throw new ServicioVentas.Application.Exceptions.ForbiddenAccessException("No tienes permisos para ver los movimientos de esa caja.");

        var movimientos = await cajaRepositoryQuery.GetMovimientosByCajaIdAsync(query.CajaId);
        return mapper.Map<List<MovimientoCajaDto>>(movimientos);
    }

    public async Task<PagedResultDto<MovimientoCajaDto>> HandlePaged(GetMovimientosCajaQuery query)
    {
        var caja = await cajaRepositoryQuery.GetByIdAsync(query.CajaId)
            ?? throw new KeyNotFoundException("Caja no encontrada.");

        if (!query.EsAdmin && caja.UsuarioAperturaId != query.UsuarioId)
            throw new ServicioVentas.Application.Exceptions.ForbiddenAccessException("No tienes permisos para ver los movimientos de esa caja.");

        var pageIndex = Math.Max(query.PageIndex ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 50);
        var (movimientos, totalItems) = await cajaRepositoryQuery.GetMovimientosByCajaIdPagedAsync(query.CajaId, pageIndex, pageSize);

        return new PagedResultDto<MovimientoCajaDto>
        {
            Items = mapper.Map<List<MovimientoCajaDto>>(movimientos),
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalItems == 0 ? 0 : (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }
}
