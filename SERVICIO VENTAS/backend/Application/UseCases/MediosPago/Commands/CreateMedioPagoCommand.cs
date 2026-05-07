using ServicioVentas.Application.DTOs.MediosPago;

namespace ServicioVentas.Application.UseCases.MediosPago.Commands;

public class CreateMedioPagoCommand
{
    public CreateMedioPagoDto MedioPago { get; set; } = null!;
}
