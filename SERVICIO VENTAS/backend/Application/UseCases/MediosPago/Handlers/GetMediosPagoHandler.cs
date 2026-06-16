using AutoMapper;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.DTOs.MediosPago;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.MediosPago.Queries;

namespace ServicioVentas.Application.UseCases.MediosPago.Handlers;

public class GetMediosPagoHandler(IMapper mapper, IMedioPagoRepositoryQuery queryRepo) : IGetMediosPagoHandler
{
    public async Task<List<MedioPagoDto>> Handle(GetMediosPagoQuery query) => mapper.Map<List<MedioPagoDto>>(await queryRepo.GetAllAsync());

    public async Task<PagedResultDto<MedioPagoDto>> HandlePaged(GetMediosPagoQuery query)
    {
        var pageIndex = Math.Max(query.PageIndex ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 50);
        var (mediosPago, totalItems) = await queryRepo.GetPagedAsync(pageIndex, pageSize, query.Search, query.Estado);

        return new PagedResultDto<MedioPagoDto>
        {
            Items = mapper.Map<List<MedioPagoDto>>(mediosPago),
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalItems == 0 ? 0 : (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }
}
