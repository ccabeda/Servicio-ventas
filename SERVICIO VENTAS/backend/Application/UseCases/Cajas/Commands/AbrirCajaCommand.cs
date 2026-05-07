using ServicioVentas.Application.DTOs.Cajas;

namespace ServicioVentas.Application.UseCases.Cajas.Commands;

public class AbrirCajaCommand
{
    public AbrirCajaDto Caja { get; set; } = null!;
}
