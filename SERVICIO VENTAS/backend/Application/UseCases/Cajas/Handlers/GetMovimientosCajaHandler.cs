using AutoMapper;
using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Cajas.Queries;

namespace ServicioVentas.Application.UseCases.Cajas.Handlers;

public class GetMovimientosCajaHandler(IMapper mapper, ICajaRepositoryQuery cajaRepositoryQuery) : IGetMovimientosCajaHandler
{
    public async Task<List<MovimientoCajaDto>> Handle(GetMovimientosCajaQuery query)
    {
        var movimientos = await cajaRepositoryQuery.GetMovimientosByCajaIdAsync(query.CajaId);
        return mapper.Map<List<MovimientoCajaDto>>(movimientos);
    }
}
