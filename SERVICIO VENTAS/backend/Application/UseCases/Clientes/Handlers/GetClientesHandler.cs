using AutoMapper;
using ServicioVentas.Application.DTOs.Clientes;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Clientes.Queries;

namespace ServicioVentas.Application.UseCases.Clientes.Handlers;

public class GetClientesHandler(IMapper mapper, IClienteRepositoryQuery queryRepo) : IGetClientesHandler
{
    public async Task<List<ClienteDto>> Handle(GetClientesQuery query) => mapper.Map<List<ClienteDto>>(await queryRepo.GetAllAsync());
}
