namespace ServicioVentas.Application.DTOs.Productos;

public class ProductoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? CodigoBarra { get; set; }
    public string? CodigoInterno { get; set; }
    public decimal Precio { get; set; }
    public decimal Costo { get; set; }
    public decimal Stock { get; set; }
    public bool Activo { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime? FechaActualizacion { get; set; }
}
