using ServicioVentas.Application.DTOs.Cajas;

namespace ServicioVentas.Application.UseCases.Cajas.Commands;

public class CerrarCajaCommand
{
    public int CajaId { get; set; }
    public CerrarCajaDto Caja { get; set; } = null!;
}
