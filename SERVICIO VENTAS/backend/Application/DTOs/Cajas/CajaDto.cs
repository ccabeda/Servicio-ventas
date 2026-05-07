namespace ServicioVentas.Application.DTOs.Cajas;

public class CajaDto
{
    public int Id { get; set; }
    public DateTime FechaApertura { get; set; }
    public decimal MontoInicial { get; set; }
    public DateTime? FechaCierre { get; set; }
    public decimal? MontoFinal { get; set; }
    public decimal? Diferencia { get; set; }
    public bool Abierta { get; set; }
    public int UsuarioAperturaId { get; set; }
    public int? UsuarioCierreId { get; set; }
}
