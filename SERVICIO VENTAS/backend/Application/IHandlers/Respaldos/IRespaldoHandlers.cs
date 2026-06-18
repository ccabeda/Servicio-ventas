using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.DTOs.Respaldos;
using ServicioVentas.Application.UseCases.Respaldos.Commands;
using ServicioVentas.Application.UseCases.Respaldos.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface ICrearRespaldoHandler
{
    Task<RespaldoDto> Handle(CrearRespaldoCommand command);
}

public interface IListarRespaldosHandler
{
    Task<PagedResultDto<RespaldoDto>> HandlePaged(ListarRespaldosQuery query);
}

public interface IGetRespaldoConfiguracionHandler
{
    Task<RespaldoConfiguracionDto> Handle(GetRespaldoConfiguracionQuery query);
}

public interface IUpdateRespaldoConfiguracionHandler
{
    Task<RespaldoConfiguracionDto> Handle(UpdateRespaldoConfiguracionCommand command);
}

public interface IDescargarRespaldoHandler
{
    Task<RespaldoArchivoDto> Handle(DescargarRespaldoQuery query);
}

public interface IRestaurarRespaldoHandler
{
    Task<RespaldoRestauradoDto> Handle(RestaurarRespaldoCommand command);
}
