namespace ServicioVentas.Domain.Models;

public class ConfiguracionTicket
{
    public int Id { get; set; }
    public int? ImpresoraId { get; set; }
    public Impresora? Impresora { get; set; }
    public string? ImpresoraNombreSistema { get; set; }
    public string? MensajeTicket { get; set; }
    public int AnchoPapelMm { get; set; } = 80;
    public bool UsaAnchoPersonalizado { get; set; }
    public bool UsaTicketTermico { get; set; } = true;
    public bool VistaPreviaAntesImprimir { get; set; } = true;
    public bool ImprimirDatosNegocioTicket { get; set; } = true;
    public bool ImprimirCopiaTicket { get; set; }
    public bool LetraGrandePantallaTactil { get; set; }
    public bool ImprimirFechaHoraTicket { get; set; } = true;
    public bool ImprimirCajeroTicket { get; set; } = true;
    public bool ImprimirNumeroTicket { get; set; } = true;
    public bool CorteAutomatico { get; set; } = true;
}
