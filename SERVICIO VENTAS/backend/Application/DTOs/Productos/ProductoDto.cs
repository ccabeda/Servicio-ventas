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
    public int? CategoriaId { get; set; }
    public string? Categoria { get; set; }
    public int? MarcaId { get; set; }
    public string? Marca { get; set; }
    public bool Activo { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime? FechaActualizacion { get; set; }
}
