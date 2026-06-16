using ServicioVentas.Application.DTOs.Auditoria;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.UseCases.Auditoria.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface IGetAuditoriaEventosHandler
{
    Task<PagedResultDto<AuditoriaEventoDto>> HandlePaged(GetAuditoriaEventosQuery query);
}

public interface IGetAuditoriaEventoByIdHandler
{
    Task<AuditoriaEventoDto> Handle(GetAuditoriaEventoByIdQuery query);
}
