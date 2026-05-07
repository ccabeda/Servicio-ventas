using AutoMapper;
using ServicioVentas.Application.DTOs.Ventas;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Ventas.Queries;

namespace ServicioVentas.Application.UseCases.Ventas.Handlers;

public class GetVentasHandler(IMapper mapper, IVentaRepositoryQuery queryRepo) : IGetVentasHandler
{
    public async Task<List<VentaDto>> Handle(GetVentasQuery query) => mapper.Map<List<VentaDto>>(await queryRepo.GetAllAsync());
}
