namespace ServicioVentas.Domain.Models;

public class Impresora
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string NombreSistema { get; set; } = string.Empty;
    public string? Modelo { get; set; }
    public string? Conexion { get; set; }
    public string? Puerto { get; set; }
    public string Tipo { get; set; } = "Ticket";
    public int AnchoPapelMm { get; set; } = 80;
    public bool EsPredeterminada { get; set; }
    public bool CorteAutomatico { get; set; } = true;
    public string DensidadImpresion { get; set; } = "Media";
    public bool Activa { get; set; } = true;
}
