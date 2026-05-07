namespace ServicioVentas.Application.DTOs.Clientes;

public class ClienteDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public decimal Deuda { get; set; }
    public bool Activo { get; set; }
}

public class CreateClienteDto
{
    public string Nombre { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public decimal Deuda { get; set; }
    public bool Activo { get; set; } = true;
}

public class UpdateClienteDto
{
    public string Nombre { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public decimal Deuda { get; set; }
    public bool Activo { get; set; } = true;
}
