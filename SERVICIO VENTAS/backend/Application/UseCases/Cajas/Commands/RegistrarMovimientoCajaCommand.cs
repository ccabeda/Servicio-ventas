using ServicioVentas.Application.DTOs.Cajas;

namespace ServicioVentas.Application.UseCases.Cajas.Commands;

public class RegistrarMovimientoCajaCommand
{
    public int CajaId { get; set; }
    public RegistrarMovimientoCajaDto Movimiento { get; set; } = null!;
}
