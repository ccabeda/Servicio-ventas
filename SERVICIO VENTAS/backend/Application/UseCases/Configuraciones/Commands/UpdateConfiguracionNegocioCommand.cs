using ServicioVentas.Application.DTOs.Configuraciones;

namespace ServicioVentas.Application.UseCases.Configuraciones.Commands;

public class UpdateConfiguracionNegocioCommand
{
    public int Id { get; set; }
    public UpdateConfiguracionNegocioDto Configuracion { get; set; } = null!;
}
