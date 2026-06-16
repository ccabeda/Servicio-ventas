namespace ServicioVentas.Domain.Models;

public class Producto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? CodigoBarra { get; set; }
    public string? CodigoInterno { get; set; }
    public decimal Precio { get; set; }
    public decimal Costo { get; set; }
    public decimal Stock { get; set; }
    public int? CategoriaId { get; set; }
    public int? MarcaId { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public DateTime? FechaActualizacion { get; set; }

    public CategoriaProducto? Categoria { get; set; }
    public MarcaProducto? Marca { get; set; }
    public ICollection<VentaDetalle> VentaDetalles { get; set; } = new List<VentaDetalle>();
    public ICollection<MovimientoStock> MovimientosStock { get; set; } = new List<MovimientoStock>();
}
