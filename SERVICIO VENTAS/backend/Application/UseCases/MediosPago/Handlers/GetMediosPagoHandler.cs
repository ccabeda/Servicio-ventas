using AutoMapper;
using ServicioVentas.Application.DTOs.MediosPago;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.MediosPago.Queries;

namespace ServicioVentas.Application.UseCases.MediosPago.Handlers;

public class GetMediosPagoHandler(IMapper mapper, IMedioPagoRepositoryQuery queryRepo) : IGetMediosPagoHandler
{
    public async Task<List<MedioPagoDto>> Handle(GetMediosPagoQuery query) => mapper.Map<List<MedioPagoDto>>(await queryRepo.GetAllAsync());
}
