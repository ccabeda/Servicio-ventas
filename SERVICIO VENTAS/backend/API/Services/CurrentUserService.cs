using System.Security.Claims;
using ServicioVentas.API.Security;

namespace ServicioVentas.API.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    private ClaimsPrincipal User => httpContextAccessor.HttpContext?.User
        ?? throw new UnauthorizedAccessException("Usuario no autenticado.");

    public int UserId
    {
        get
        {
            var value = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("Usuario no autenticado.");

            return int.TryParse(value, out var userId)
                ? userId
                : throw new UnauthorizedAccessException("Token inválido.");
        }
    }

    public string UserName => User.FindFirstValue(ClaimTypes.Name)
        ?? User.Identity?.Name
        ?? throw new UnauthorizedAccessException("Token inválido.");

    public string Role => User.FindFirstValue(ClaimTypes.Role)
        ?? throw new UnauthorizedAccessException("Token inválido.");

    public IReadOnlyList<string> Permissions => User.FindAll(JwtTokenGenerator.PermissionClaimType)
        .Select(x => x.Value)
        .Distinct()
        .ToList();

    public bool IsAdmin => User.IsInRole("Admin");
}
