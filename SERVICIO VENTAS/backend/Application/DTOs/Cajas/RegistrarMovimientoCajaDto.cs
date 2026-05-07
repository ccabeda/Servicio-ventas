using ServicioVentas.Domain.Enums;

namespace ServicioVentas.Application.DTOs.Cajas;

public class RegistrarMovimientoCajaDto
{
    public TipoMovimientoCaja Tipo { get; set; }
    public string Concepto { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public int UsuarioId { get; set; }
}
