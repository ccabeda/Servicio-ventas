namespace ServicioVentas.Domain.Models;

public class CategoriaProducto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Icono { get; set; }
    public string? Color { get; set; }
    public int? ImpuestoId { get; set; }
    public bool Activo { get; set; } = true;

    public Impuesto? Impuesto { get; set; }
    public ICollection<Producto> Productos { get; set; } = new List<Producto>();
}
