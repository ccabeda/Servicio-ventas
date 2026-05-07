using AutoMapper;
using ServicioVentas.Application.DTOs.Clientes;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.UseCases.Clientes.Commands;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Clientes.Handlers;

public class CreateClienteHandler(IMapper mapper, IClienteRepositoryCommand commandRepo) : ICreateClienteHandler
{
    public async Task<ClienteDto> Handle(CreateClienteCommand command)
    {
        var cliente = mapper.Map<Cliente>(command.Cliente);

        await commandRepo.AddAsync(cliente);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<ClienteDto>(cliente);
    }
}
