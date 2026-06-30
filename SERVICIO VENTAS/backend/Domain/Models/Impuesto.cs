namespace ServicioVentas.Domain.Models;

public class Impuesto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public decimal Porcentaje { get; set; }
    public bool Activo { get; set; } = true;
    public bool EsPredeterminado { get; set; }
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    public ICollection<Producto> Productos { get; set; } = new List<Producto>();
    public ICollection<CategoriaProducto> Categorias { get; set; } = new List<CategoriaProducto>();
}
