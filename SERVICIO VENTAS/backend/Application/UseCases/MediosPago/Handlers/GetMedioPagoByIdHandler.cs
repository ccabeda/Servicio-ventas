using AutoMapper;
using ServicioVentas.Application.DTOs.MediosPago;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.MediosPago.Queries;

namespace ServicioVentas.Application.UseCases.MediosPago.Handlers;

public class GetMedioPagoByIdHandler(IMapper mapper, IMedioPagoRepositoryQuery queryRepo) : IGetMedioPagoByIdHandler
{
    public async Task<MedioPagoDto> Handle(GetMedioPagoByIdQuery query) => mapper.Map<MedioPagoDto>(await queryRepo.GetByIdAsync(query.Id) ?? throw new KeyNotFoundException("Medio de pago no encontrado."));
}
