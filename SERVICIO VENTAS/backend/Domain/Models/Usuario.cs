using ServicioVentas.Domain.Enums;

namespace ServicioVentas.Domain.Models;

public class Usuario
{
    public int Id { get; set; }
    public string NombreUsuario { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public RolUsuario Rol { get; set; } = RolUsuario.Cajero;
    public bool Activo { get; set; } = true;
    public bool DebeCambiarPassword { get; set; } = true;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    public ICollection<Venta> Ventas { get; set; } = new List<Venta>();
    public ICollection<Caja> CajasAbiertas { get; set; } = new List<Caja>();
    public ICollection<Caja> CajasCerradas { get; set; } = new List<Caja>();
    public ICollection<MovimientoCaja> MovimientosCaja { get; set; } = new List<MovimientoCaja>();
}
