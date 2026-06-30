namespace ServicioVentas.Domain.Models;

public class ConfiguracionNegocio
{
    public int Id { get; set; }
    public string NombreNegocio { get; set; } = string.Empty;
    public string? Direccion { get; set; }
    public string? Telefono { get; set; }
    public string? Email { get; set; }
    public string? DiasAtencion { get; set; }
    public string? HorarioApertura { get; set; }
    public string? HorarioCierre { get; set; }
    public string? LogoUrl { get; set; }
    public string ColorPrincipal { get; set; } = "#ef0000";
    public bool ConfirmarEliminarItemCarrito { get; set; } = true;
    public bool MantenerClienteAlFinalizarVenta { get; set; } = true;
    public bool MostrarStockEnBusquedaProductos { get; set; } = true;
    public bool PedirCantidadAlAgregarProducto { get; set; }
    public bool AplicarImpuestosEnVentas { get; set; } = true;
    public decimal DescuentoMaximoPermitido { get; set; } = 20;
    public string RedondeoTotal { get; set; } = "0.05";
    public bool PedirMotivoCerrarCaja { get; set; } = true;
    public bool ImprimirResumenCerrarCaja { get; set; } = true;
    public decimal MontoMinimoAperturaCaja { get; set; }
    public string FormatoFecha { get; set; } = "dd/MM/yyyy";
    public string FormatoHora { get; set; } = "24";
    public bool MostrarMensajesAyuda { get; set; } = true;
    public bool EnviarEstadisticasAnonimas { get; set; }
}
