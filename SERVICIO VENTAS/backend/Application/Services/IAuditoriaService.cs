using ServicioVentas.Application.DTOs.Auditoria;

namespace ServicioVentas.Application.Services;

public interface IAuditoriaService
{
    Task RegistrarAsync(RegistrarAuditoriaEventoDto evento);
}
