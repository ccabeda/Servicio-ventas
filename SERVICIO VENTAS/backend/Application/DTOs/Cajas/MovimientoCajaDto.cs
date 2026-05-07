using ServicioVentas.Domain.Enums;

namespace ServicioVentas.Application.DTOs.Cajas;

public class MovimientoCajaDto
{
    public int Id { get; set; }
    public int CajaId { get; set; }
    public DateTime Fecha { get; set; }
    public TipoMovimientoCaja Tipo { get; set; }
    public string Concepto { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public int UsuarioId { get; set; }
}
