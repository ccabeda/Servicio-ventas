namespace ServicioVentas.Application.DTOs.MediosPago;

public class MedioPagoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public bool Activo { get; set; }
}

public class CreateMedioPagoDto
{
    public string Nombre { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}

public class UpdateMedioPagoDto
{
    public string Nombre { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}
