namespace ServicioVentas.Application.DTOs.Productos;

public class UpdateProductoDto
{
    public string Nombre { get; set; } = string.Empty;
    public string? CodigoBarra { get; set; }
    public string? CodigoInterno { get; set; }
    public decimal Precio { get; set; }
    public decimal Costo { get; set; }
    public decimal Stock { get; set; }
    public bool Activo { get; set; } = true;
}
