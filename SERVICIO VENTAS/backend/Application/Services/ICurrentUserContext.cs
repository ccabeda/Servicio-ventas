namespace ServicioVentas.Application.Services;

public interface ICurrentUserContext
{
    int UserId { get; }
    string UserName { get; }
    string Role { get; }
    IReadOnlyList<string> Permissions { get; }
    bool IsAdmin { get; }
}
