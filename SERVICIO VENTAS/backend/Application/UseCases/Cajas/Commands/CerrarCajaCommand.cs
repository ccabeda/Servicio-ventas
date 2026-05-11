using ServicioVentas.Application.DTOs.Cajas;

namespace ServicioVentas.Application.UseCases.Cajas.Commands;

public class CerrarCajaCommand
{
    public int CajaId { get; set; }
    public int UsuarioId { get; set; }
    public bool EsAdmin { get; set; }
    public CerrarCajaDto Caja { get; set; } = null!;
}
