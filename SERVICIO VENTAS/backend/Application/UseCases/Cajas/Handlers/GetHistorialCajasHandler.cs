using AutoMapper;
using ServicioVentas.Application.DTOs.Cajas;
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
}
