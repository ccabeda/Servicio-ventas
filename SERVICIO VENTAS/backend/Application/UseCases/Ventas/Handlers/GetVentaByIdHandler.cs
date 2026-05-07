using AutoMapper;
using ServicioVentas.Application.DTOs.Ventas;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Ventas.Queries;

namespace ServicioVentas.Application.UseCases.Ventas.Handlers;

public class GetVentaByIdHandler(IMapper mapper, IVentaRepositoryQuery queryRepo) : IGetVentaByIdHandler
{
    public async Task<VentaDto> Handle(GetVentaByIdQuery query) => mapper.Map<VentaDto>(await queryRepo.GetByIdAsync(query.Id) ?? throw new KeyNotFoundException("Venta no encontrada."));
}
