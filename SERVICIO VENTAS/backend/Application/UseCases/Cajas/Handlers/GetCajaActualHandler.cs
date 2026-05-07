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
        return caja is null ? null : mapper.Map<CajaDto>(caja);
    }
}
