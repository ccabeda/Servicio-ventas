using ServicioVentas.Application.DTOs.Configuraciones;

namespace ServicioVentas.Application.UseCases.Configuraciones.Commands;

public class PrintTicketPruebaImpresoraCommand
{
    public int? ImpresoraId { get; set; }
    public TicketPruebaImpresoraRequest Request { get; set; } = null!;
}
