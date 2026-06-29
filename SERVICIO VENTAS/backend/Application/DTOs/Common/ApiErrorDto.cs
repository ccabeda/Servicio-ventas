namespace ServicioVentas.Application.DTOs.Common;

public class ApiErrorDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public List<ApiFieldErrorDto> Errors { get; set; } = [];
}

public class ApiFieldErrorDto
{
    public string? Field { get; set; }
    public string Message { get; set; } = string.Empty;
}
