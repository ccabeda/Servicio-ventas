using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.DTOs.Respaldos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.Services;
using ServicioVentas.Application.UseCases.Respaldos.Commands;
using ServicioVentas.Application.UseCases.Respaldos.Queries;

namespace ServicioVentas.Application.UseCases.Respaldos.Handlers;

public class CrearRespaldoHandler(IRespaldoService respaldoService) : ICrearRespaldoHandler
{
    public Task<RespaldoDto> Handle(CrearRespaldoCommand command)
    {
        return respaldoService.CrearAsync(command.Request);
    }
}

public class ListarRespaldosHandler(IRespaldoService respaldoService) : IListarRespaldosHandler
{
    public Task<PagedResultDto<RespaldoDto>> HandlePaged(ListarRespaldosQuery query)
    {
        var pageIndex = Math.Max(query.PageIndex ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 4, 1, 20);
        return respaldoService.ListarPaginadoAsync(pageIndex, pageSize);
    }
}

public class GetRespaldoConfiguracionHandler(IRespaldoService respaldoService) : IGetRespaldoConfiguracionHandler
{
    public Task<RespaldoConfiguracionDto> Handle(GetRespaldoConfiguracionQuery query)
    {
        return respaldoService.GetConfiguracionAsync();
    }
}

public class UpdateRespaldoConfiguracionHandler(IRespaldoService respaldoService) : IUpdateRespaldoConfiguracionHandler
{
    public Task<RespaldoConfiguracionDto> Handle(UpdateRespaldoConfiguracionCommand command)
    {
        return respaldoService.UpdateConfiguracionAsync(command.Request);
    }
}

public class DescargarRespaldoHandler(IRespaldoService respaldoService) : IDescargarRespaldoHandler
{
    public Task<RespaldoArchivoDto> Handle(DescargarRespaldoQuery query)
    {
        return respaldoService.DescargarAsync(query.NombreArchivo);
    }
}

public class RestaurarRespaldoHandler(IRespaldoService respaldoService) : IRestaurarRespaldoHandler
{
    public Task<RespaldoRestauradoDto> Handle(RestaurarRespaldoCommand command)
    {
        return respaldoService.RestaurarAsync(command.Archivo);
    }
}
