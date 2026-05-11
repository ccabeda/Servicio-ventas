using AutoMapper;
using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Cajas.Queries;

namespace ServicioVentas.Application.UseCases.Cajas.Handlers;

public class GetCajaActualHandler(IMapper mapper, ICajaRepositoryQuery cajaRepositoryQuery) : IGetCajaActualHandler
{
    public async Task<CajaDto?> Handle(GetCajaActualQuery query)
    {
        var caja = await cajaRepositoryQuery.GetCajaAbiertaAsync();
        if (caja is null)
            return null;

        var cajaDto = mapper.Map<CajaDto>(caja);
        cajaDto.SaldoSistema = await cajaRepositoryQuery.GetSaldoSistemaByCajaIdAsync(caja.Id);
        return cajaDto;
    }
}
