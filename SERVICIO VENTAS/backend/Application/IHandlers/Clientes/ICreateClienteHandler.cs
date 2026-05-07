using ServicioVentas.Application.DTOs.Clientes;
using ServicioVentas.Application.UseCases.Clientes.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface ICreateClienteHandler
{
    Task<ClienteDto> Handle(CreateClienteCommand command);
}
