namespace ServicioVentas.Application.DTOs.Productos;

public class CategoriaProductoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Icono { get; set; }
    public string? Color { get; set; }
    public int? ImpuestoId { get; set; }
}

public class CreateCategoriaProductoDto
{
    public string Nombre { get; set; } = string.Empty;
    public string? Icono { get; set; }
    public string? Color { get; set; }
    public int? ImpuestoId { get; set; }
}

public class UpdateCategoriaProductoDto
{
    public string Nombre { get; set; } = string.Empty;
    public string? Icono { get; set; }
    public string? Color { get; set; }
    public int? ImpuestoId { get; set; }
}
