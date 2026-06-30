namespace ServicioVentas.Application.DTOs.Cajas;

public class CajaMedioPagoResumenDto
{
    public int MedioPagoId { get; set; }
    public string MedioPagoNombre { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public int CantidadVentas { get; set; }
    public bool EsEfectivo { get; set; }
}

public class CajaResumenDto
{
    public CajaDto Caja { get; set; } = null!;
    public List<MovimientoCajaDto> Movimientos { get; set; } = [];
    public List<CajaMedioPagoResumenDto> VentasPorMedioPago { get; set; } = [];
    public decimal MontoInicial { get; set; }
    public decimal VentasEfectivo { get; set; }
    public decimal TotalVentas { get; set; }
    public decimal IngresosManuales { get; set; }
    public decimal Egresos { get; set; }
    public decimal TotalEsperado { get; set; }
    public decimal? MontoContado { get; set; }
    public decimal? Diferencia { get; set; }
    public string? Observacion { get; set; }
}
