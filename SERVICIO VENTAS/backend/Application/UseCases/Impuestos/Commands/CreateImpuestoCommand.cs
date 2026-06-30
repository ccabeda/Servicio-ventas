using ServicioVentas.Application.DTOs.Impuestos;

namespace ServicioVentas.Application.UseCases.Impuestos.Commands;

public class CreateImpuestoCommand
{
    public CreateImpuestoDto Impuesto { get; set; } = null!;
}
