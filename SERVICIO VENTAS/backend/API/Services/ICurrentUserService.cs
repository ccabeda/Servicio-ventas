namespace ServicioVentas.API.Services;

public interface ICurrentUserService
{
    int UserId { get; }
    string UserName { get; }
    string Role { get; }
    IReadOnlyList<string> Permissions { get; }
    bool IsAdmin { get; }
}
