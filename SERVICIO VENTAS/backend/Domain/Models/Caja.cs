namespace ServicioVentas.Domain.Models;

public class Caja
{
    public int Id { get; set; }
    public DateTime FechaApertura { get; set; } = DateTime.UtcNow;
    public decimal MontoInicial { get; set; }
    public DateTime? FechaCierre { get; set; }
    public decimal? MontoFinal { get; set; }
    public decimal? Diferencia { get; set; }
    public string? MotivoCierre { get; set; }
    public bool Abierta { get; set; } = true;
    public int UsuarioAperturaId { get; set; }
    public int? UsuarioCierreId { get; set; }

    public Usuario UsuarioApertura { get; set; } = null!;
    public Usuario? UsuarioCierre { get; set; }
    public ICollection<Venta> Ventas { get; set; } = new List<Venta>();
    public ICollection<MovimientoCaja> Movimientos { get; set; } = new List<MovimientoCaja>();
}
