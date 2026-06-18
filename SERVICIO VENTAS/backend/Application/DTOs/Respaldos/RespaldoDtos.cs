namespace ServicioVentas.Application.DTOs.Respaldos;

public class RespaldoDto
{
    public string NombreArchivo { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
    public long TamanoBytes { get; set; }
    public string UrlDescarga { get; set; } = string.Empty;
}

public class RespaldoRestauradoDto
{
    public string NombreArchivo { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
    public string Mensaje { get; set; } = string.Empty;
}

public class RespaldoConfiguracionDto
{
    public string Directorio { get; set; } = string.Empty;
    public string DirectorioVisible { get; set; } = string.Empty;
    public bool UsaUbicacionPredeterminada { get; set; }
    public string Frecuencia { get; set; } = "daily";
    public string Hora { get; set; } = "03:00";
    public int? DiaSemana { get; set; }
    public int? DiaMes { get; set; }
    public DateTimeOffset? ProximoRespaldo { get; set; }
}

public class CrearRespaldoDto
{
    public string? Nombre { get; set; }
}

public class UpdateRespaldoConfiguracionDto
{
    public string? Directorio { get; set; }
    public string? Frecuencia { get; set; }
    public string? Hora { get; set; }
    public int? DiaSemana { get; set; }
    public int? DiaMes { get; set; }
}

public class RespaldoArchivoDto
{
    public string NombreArchivo { get; set; } = string.Empty;
    public string RutaFisica { get; set; } = string.Empty;
    public string ContentType { get; set; } = "application/zip";
}
