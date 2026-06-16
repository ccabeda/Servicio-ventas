namespace ServicioVentas.Application.DTOs.Productos;

public class UpdateProductoDto
{
    public string Nombre { get; set; } = string.Empty;
    public string? CodigoBarra { get; set; }
    public string? CodigoInterno { get; set; }
    public decimal Precio { get; set; }
    public decimal Costo { get; set; }
    public int? CategoriaId { get; set; }
    public int? MarcaId { get; set; }
    public bool Activo { get; set; } = true;
}
