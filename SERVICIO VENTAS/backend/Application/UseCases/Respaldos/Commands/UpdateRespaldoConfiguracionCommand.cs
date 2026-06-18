using ServicioVentas.Application.DTOs.Respaldos;

namespace ServicioVentas.Application.UseCases.Respaldos.Commands;

public class UpdateRespaldoConfiguracionCommand
{
    public UpdateRespaldoConfiguracionDto Request { get; set; } = new();
}
