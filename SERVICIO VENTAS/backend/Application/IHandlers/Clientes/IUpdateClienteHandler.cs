using ServicioVentas.Application.DTOs.Clientes;
using ServicioVentas.Application.UseCases.Clientes.Commands;

namespace ServicioVentas.Application.IHandlers;

public interface IUpdateClienteHandler
{
    Task<ClienteDto> Handle(UpdateClienteCommand command);
}
