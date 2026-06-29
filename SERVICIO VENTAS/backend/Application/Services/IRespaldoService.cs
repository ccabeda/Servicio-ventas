using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.DTOs.Respaldos;

namespace ServicioVentas.Application.Services;

public interface IRespaldoService
{
    Task<RespaldoConfiguracionDto> GetConfiguracionAsync();
    Task<RespaldoConfiguracionDto> UpdateConfiguracionAsync(UpdateRespaldoConfiguracionDto request);
    Task<PagedResultDto<RespaldoDto>> ListarPaginadoAsync(int pageIndex, int pageSize);
    Task<RespaldoArchivoDto> DescargarAsync(string nombreArchivo);
    Task<RespaldoDto> CrearAsync(CrearRespaldoDto request);
    Task<RespaldoDto?> CrearAutomaticoPendienteAsync(DateTimeOffset ahora);
    Task<RespaldoRestauradoDto> RestaurarAsync(ApplicationFile? archivo);
}
