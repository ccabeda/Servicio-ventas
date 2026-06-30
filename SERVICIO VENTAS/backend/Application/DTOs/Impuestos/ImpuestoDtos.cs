namespace ServicioVentas.Application.DTOs.Impuestos;

public class ImpuestoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public decimal Porcentaje { get; set; }
    public bool Activo { get; set; }
    public bool EsPredeterminado { get; set; }
}

public class CreateImpuestoDto
{
    public string Nombre { get; set; } = string.Empty;
    public decimal Porcentaje { get; set; }
    public bool Activo { get; set; } = true;
    public bool EsPredeterminado { get; set; }
}

public class UpdateImpuestoDto
{
    public string Nombre { get; set; } = string.Empty;
    public decimal Porcentaje { get; set; }
    public bool Activo { get; set; } = true;
    public bool EsPredeterminado { get; set; }
}

public class ImpuestoResumenDto
{
    public int TasasActivas { get; set; }
    public int ProductosSinTasa { get; set; }
    public ImpuestoDto? Predeterminado { get; set; }
}
