namespace ServicioVentas.Application.DTOs.Configuraciones;

public class ImpresoraDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string NombreSistema { get; set; } = string.Empty;
    public string? Modelo { get; set; }
    public string? Conexion { get; set; }
    public string? Puerto { get; set; }
    public string Tipo { get; set; } = "Ticket";
    public int AnchoPapelMm { get; set; }
    public bool EsPredeterminada { get; set; }
    public bool CorteAutomatico { get; set; }
    public string DensidadImpresion { get; set; } = "Media";
    public bool Activa { get; set; }
}

public class CreateImpresoraDto
{
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

public class UpdateImpresoraDto : CreateImpresoraDto;

public class ImpresoraDetectadaDto
{
    public string Nombre { get; set; } = string.Empty;
    public bool Predeterminada { get; set; }
}

public record TicketPruebaImpresoraRequest(
    string? ImpresoraNombre,
    string? NombreNegocio,
    string? Mensaje,
    int AnchoMm = 80,
    bool ImprimirFechaHora = true,
    bool ImprimirCajero = true,
    bool ImprimirNumero = true,
    bool CorteAutomatico = true);
