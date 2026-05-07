using AutoMapper;
using ServicioVentas.Application.DTOs.Clientes;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Clientes.Commands;

namespace ServicioVentas.Application.UseCases.Clientes.Handlers;

public class UpdateClienteHandler(IMapper mapper, IClienteRepositoryCommand commandRepo, IClienteRepositoryQuery queryRepo) : IUpdateClienteHandler
{
    public async Task<ClienteDto> Handle(UpdateClienteCommand command)
    {
        var cliente = await queryRepo.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException("Cliente no encontrado.");
        mapper.Map(command.Cliente, cliente);

        await commandRepo.UpdateAsync(cliente);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<ClienteDto>(cliente);
    }
}
