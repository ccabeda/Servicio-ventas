using ServicioVentas.Application.DTOs.Configuraciones;

namespace ServicioVentas.Application.UseCases.Configuraciones.Commands;

public class UpdateConfiguracionTicketCommand
{
    public int Id { get; set; }
    public UpdateConfiguracionTicketDto Configuracion { get; set; } = new();
}
