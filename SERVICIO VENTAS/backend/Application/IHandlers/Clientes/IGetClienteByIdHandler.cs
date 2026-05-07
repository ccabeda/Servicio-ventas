using ServicioVentas.Application.DTOs.Clientes;
using ServicioVentas.Application.UseCases.Clientes.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetClienteByIdHandler
{
    Task<ClienteDto> Handle(GetClienteByIdQuery query);
}
