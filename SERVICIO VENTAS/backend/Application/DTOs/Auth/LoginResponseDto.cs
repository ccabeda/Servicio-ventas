namespace ServicioVentas.Application.DTOs.Auth;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public int UsuarioId { get; set; }
    public string NombreUsuario { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public bool DebeCambiarPassword { get; set; }
    public List<string> Permisos { get; set; } = [];
}

public class CambiarPasswordDto
{
    public string NuevaPassword { get; set; } = string.Empty;
}
