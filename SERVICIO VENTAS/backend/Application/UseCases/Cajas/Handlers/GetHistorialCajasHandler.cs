using AutoMapper;
using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Cajas.Queries;

namespace ServicioVentas.Application.UseCases.Cajas.Handlers;

public class GetHistorialCajasHandler(IMapper mapper, ICajaRepositoryQuery cajaRepositoryQuery) : IGetHistorialCajasHandler
{
    public async Task<List<CajaDto>> Handle(GetHistorialCajasQuery query)
    {
        var cajas = await cajaRepositoryQuery.GetHistorialAsync(query.EsAdmin ? null : query.UsuarioId);
        var cajasDto = mapper.Map<List<CajaDto>>(cajas);

        foreach (var cajaDto in cajasDto)
        {
            cajaDto.SaldoSistema = cajaDto.Abierta
                ? await cajaRepositoryQuery.GetSaldoSistemaByCajaIdAsync(cajaDto.Id)
                : (cajaDto.MontoFinal ?? 0) - (cajaDto.Diferencia ?? 0);
        }

        return cajasDto;
    }

    public async Task<PagedResultDto<CajaDto>> HandlePaged(GetHistorialCajasQuery query)
    {
        var pageIndex = Math.Max(query.PageIndex ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 50);
        var (cajas, totalItems) = await cajaRepositoryQuery.GetHistorialPagedAsync(
            pageIndex,
            pageSize,
            query.EsAdmin ? null : query.UsuarioId);
        var cajasDto = mapper.Map<List<CajaDto>>(cajas);

        foreach (var cajaDto in cajasDto)
        {
            cajaDto.SaldoSistema = cajaDto.Abierta
                ? await cajaRepositoryQuery.GetSaldoSistemaByCajaIdAsync(cajaDto.Id)
                : (cajaDto.MontoFinal ?? 0) - (cajaDto.Diferencia ?? 0);
        }

        return new PagedResultDto<CajaDto>
        {
            Items = cajasDto,
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalItems == 0 ? 0 : (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }
}
