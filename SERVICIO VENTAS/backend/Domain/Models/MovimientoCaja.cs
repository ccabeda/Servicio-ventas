using ServicioVentas.Domain.Enums;

namespace ServicioVentas.Domain.Models;

public class MovimientoCaja
{
    public int Id { get; set; }
    public int CajaId { get; set; }
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    public TipoMovimientoCaja Tipo { get; set; }
    public string Concepto { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public int UsuarioId { get; set; }

    public Caja Caja { get; set; } = null!;
    public Usuario Usuario { get; set; } = null!;
}
