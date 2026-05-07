using ServicioVentas.Application.DTOs.Configuraciones;

namespace ServicioVentas.Application.UseCases.Configuraciones.Commands;

public class CreateConfiguracionNegocioCommand
{
    public CreateConfiguracionNegocioDto Configuracion { get; set; } = null!;
}
