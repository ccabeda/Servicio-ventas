using AutoMapper;
using ServicioVentas.Application.DTOs.Clientes;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Clientes.Queries;

namespace ServicioVentas.Application.UseCases.Clientes.Handlers;

public class GetClienteByIdHandler(IMapper mapper, IClienteRepositoryQuery queryRepo) : IGetClienteByIdHandler
{
    public async Task<ClienteDto> Handle(GetClienteByIdQuery query) => mapper.Map<ClienteDto>(await queryRepo.GetByIdAsync(query.Id) ?? throw new KeyNotFoundException("Cliente no encontrado."));
}
