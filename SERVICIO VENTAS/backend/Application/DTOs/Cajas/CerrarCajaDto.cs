namespace ServicioVentas.Application.DTOs.Cajas;

public class CerrarCajaDto
{
    public decimal MontoFinal { get; set; }
    public int UsuarioCierreId { get; set; }
    public string? MotivoCierre { get; set; }
}
