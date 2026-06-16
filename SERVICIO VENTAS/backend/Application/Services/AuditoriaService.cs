using ServicioVentas.Application.DTOs.Auditoria;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.Services;

public class AuditoriaService(IAuditoriaEventoRepositoryCommand commandRepo, IClock clock) : IAuditoriaService
{
    public async Task RegistrarAsync(RegistrarAuditoriaEventoDto evento)
    {
        await commandRepo.AddAsync(new AuditoriaEvento
        {
            Fecha = clock.UtcNow,
            UsuarioId = evento.UsuarioId,
            Modulo = evento.Modulo.Trim(),
            Accion = evento.Accion.Trim(),
            Entidad = evento.Entidad.Trim(),
            EntidadId = string.IsNullOrWhiteSpace(evento.EntidadId) ? null : evento.EntidadId.Trim(),
            Detalle = evento.Detalle.Trim(),
            ValoresAnterioresJson = string.IsNullOrWhiteSpace(evento.ValoresAnterioresJson) ? null : evento.ValoresAnterioresJson,
            ValoresNuevosJson = string.IsNullOrWhiteSpace(evento.ValoresNuevosJson) ? null : evento.ValoresNuevosJson,
            Ip = string.IsNullOrWhiteSpace(evento.Ip) ? null : evento.Ip.Trim()
        });
    }
}
