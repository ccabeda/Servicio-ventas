using ServicioVentas.Domain.Enums;

namespace ServicioVentas.Application.DTOs.Usuarios;

public class UsuarioDto
{
    public int Id { get; set; }
    public string NombreUsuario { get; set; } = string.Empty;
    public RolUsuario Rol { get; set; }
    public bool Activo { get; set; }
    public bool DebeCambiarPassword { get; set; }
    public DateTime FechaCreacion { get; set; }
}

public class CreateUsuarioDto
{
    public string NombreUsuario { get; set; } = string.Empty;
    public string? Password { get; set; }
    public RolUsuario Rol { get; set; } = RolUsuario.Cajero;
    public bool Activo { get; set; } = true;
    public bool DebeCambiarPassword { get; set; } = true;
}

public class UpdateUsuarioDto
{
    public string NombreUsuario { get; set; } = string.Empty;
    public string? Password { get; set; }
    public RolUsuario Rol { get; set; } = RolUsuario.Cajero;
    public bool Activo { get; set; } = true;
    public bool DebeCambiarPassword { get; set; }
}
