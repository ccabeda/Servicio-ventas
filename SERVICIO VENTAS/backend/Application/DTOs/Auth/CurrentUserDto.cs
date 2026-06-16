namespace ServicioVentas.Application.DTOs.Auth;

public class CurrentUserDto
{
    public int UsuarioId { get; set; }
    public string NombreUsuario { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public List<string> Permisos { get; set; } = [];
}
