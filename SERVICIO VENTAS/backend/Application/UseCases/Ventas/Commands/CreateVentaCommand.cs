using ServicioVentas.Application.DTOs.Ventas;

namespace ServicioVentas.Application.UseCases.Ventas.Commands;

public class CreateVentaCommand
{
    public int UsuarioId { get; set; }
    public CreateVentaDto Venta { get; set; } = null!;
}
