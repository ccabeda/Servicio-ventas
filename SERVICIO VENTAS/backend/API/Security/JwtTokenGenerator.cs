using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ServicioVentas.Application.ISecurity;

namespace ServicioVentas.API.Security;

public class JwtTokenGenerator(IConfiguration configuration) : IJwtTokenGenerator
{
    public const string PermissionClaimType = "permission";

    public string GenerateToken(int userId, string nombreUsuario, string rol, IEnumerable<string> permisos)
    {
        var key = configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key no configurado.");
        var issuer = configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer no configurado.");
        var audience = configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience no configurado.");
        var expirationHours = int.TryParse(configuration["Jwt:ExpirationHours"], out var configuredExpirationHours)
            ? configuredExpirationHours
            : 8;
        if (expirationHours <= 0)
        {
            throw new InvalidOperationException("Jwt:ExpirationHours debe ser mayor a 0.");
        }

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, nombreUsuario),
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(ClaimTypes.Name, nombreUsuario),
            new(ClaimTypes.Role, rol)
        };
        claims.AddRange(permisos.Distinct().Select(permiso => new Claim(PermissionClaimType, permiso)));

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expirationHours),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
