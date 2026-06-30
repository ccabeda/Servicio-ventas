using ServicioVentas.Application.DTOs.Impuestos;

namespace ServicioVentas.Application.UseCases.Impuestos.Commands;

public class UpdateImpuestoCommand
{
    public int Id { get; set; }
    public UpdateImpuestoDto Impuesto { get; set; } = null!;
}
