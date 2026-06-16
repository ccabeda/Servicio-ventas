namespace ServicioVentas.Application.DTOs.Productos;

public class MarcaProductoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public bool Activa { get; set; }
}

public class CreateMarcaProductoDto
{
    public string Nombre { get; set; } = string.Empty;
    public bool Activa { get; set; } = true;
}

public class UpdateMarcaProductoDto
{
    public string Nombre { get; set; } = string.Empty;
    public bool Activa { get; set; } = true;
}
