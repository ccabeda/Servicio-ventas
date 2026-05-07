namespace ServicioVentas.Domain.Models;

public class ConfiguracionNegocio
{
    public int Id { get; set; }
    public string NombreNegocio { get; set; } = string.Empty;
    public string? Direccion { get; set; }
    public string? Telefono { get; set; }
    public string? LogoUrl { get; set; }
    public string? MensajeTicket { get; set; }
    public string? ImpresoraTicket { get; set; }
    public bool UsaTicketTermico { get; set; }
}
