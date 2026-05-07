using ServicioVentas.Application.DTOs.MediosPago;

namespace ServicioVentas.Application.UseCases.MediosPago.Commands;

public class UpdateMedioPagoCommand
{
    public int Id { get; set; }
    public UpdateMedioPagoDto MedioPago { get; set; } = null!;
}
