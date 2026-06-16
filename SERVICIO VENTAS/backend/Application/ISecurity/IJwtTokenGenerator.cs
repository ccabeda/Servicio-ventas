namespace ServicioVentas.Application.ISecurity;

public interface IJwtTokenGenerator
{
    string GenerateToken(int userId, string nombreUsuario, string rol, IEnumerable<string> permisos);
}
