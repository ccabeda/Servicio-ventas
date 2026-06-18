namespace ServicioVentas.Application.Services;

public interface ILogoStorageService
{
    Task<string> SaveLogoAsync(ApplicationFile file, string? previousLogoUrl, CancellationToken cancellationToken = default);
}
