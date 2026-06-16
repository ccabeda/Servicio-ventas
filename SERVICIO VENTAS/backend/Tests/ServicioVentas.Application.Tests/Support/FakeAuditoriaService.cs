using ServicioVentas.Application.DTOs.Auditoria;
using ServicioVentas.Application.Services;

namespace ServicioVentas.Application.Tests.Support;

public class FakeAuditoriaService : IAuditoriaService
{
    public List<RegistrarAuditoriaEventoDto> Eventos { get; } = [];

    public Task RegistrarAsync(RegistrarAuditoriaEventoDto evento)
    {
        Eventos.Add(evento);
        return Task.CompletedTask;
    }
}
