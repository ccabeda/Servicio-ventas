using ServicioVentas.Application.DTOs.Configuraciones;

namespace ServicioVentas.Application.UseCases.Configuraciones.Commands;

public class CreateImpresoraCommand
{
    public CreateImpresoraDto Impresora { get; set; } = null!;
}
