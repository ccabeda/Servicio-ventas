using ServicioVentas.Application.DTOs.Clientes;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.UseCases.Clientes.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetClientesHandler
{
    Task<List<ClienteDto>> Handle(GetClientesQuery query);
    Task<PagedResultDto<ClienteDto>> HandlePaged(GetClientesQuery query);
}
