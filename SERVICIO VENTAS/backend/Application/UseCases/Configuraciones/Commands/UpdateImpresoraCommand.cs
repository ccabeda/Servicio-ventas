using ServicioVentas.Application.DTOs.Configuraciones;

namespace ServicioVentas.Application.UseCases.Configuraciones.Commands;

public class UpdateImpresoraCommand
{
    public int Id { get; set; }
    public UpdateImpresoraDto Impresora { get; set; } = null!;
}
