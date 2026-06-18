using ServicioVentas.Application.Services;

namespace ServicioVentas.API.Services;

public class LogoStorageService(IWebHostEnvironment environment) : ILogoStorageService
{
    private const long MaxFileSize = 5 * 1024 * 1024;
    private static readonly Dictionary<string, string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        [".png"] = "image/png",
        [".jpg"] = "image/jpeg",
        [".jpeg"] = "image/jpeg"
    };

    public async Task<string> SaveLogoAsync(ApplicationFile file, string? previousLogoUrl, CancellationToken cancellationToken = default)
    {
        if (file.Length == 0)
        {
            throw new InvalidOperationException("Selecciona un archivo de logo.");
        }

        if (file.Length > MaxFileSize)
        {
            throw new InvalidOperationException("El logo no puede superar los 5MB.");
        }

        var extension = Path.GetExtension(file.FileName);
        if (!AllowedExtensions.TryGetValue(extension, out var expectedContentType) ||
            !file.ContentType.Equals(expectedContentType, StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("El logo debe ser una imagen PNG o JPG.");
        }

        var webRoot = string.IsNullOrWhiteSpace(environment.WebRootPath)
            ? Path.Combine(environment.ContentRootPath, "wwwroot")
            : environment.WebRootPath;
        var uploadPath = Path.Combine(webRoot, "uploads", "logos");
        Directory.CreateDirectory(uploadPath);

        var fileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var fullPath = Path.Combine(uploadPath, fileName);

        await using (var source = file.OpenReadStream())
        await using (var stream = File.Create(fullPath))
        {
            await source.CopyToAsync(stream, cancellationToken);
        }

        DeletePreviousLogo(webRoot, previousLogoUrl);
        return $"/uploads/logos/{fileName}";
    }

    private static void DeletePreviousLogo(string webRoot, string? previousLogoUrl)
    {
        if (string.IsNullOrWhiteSpace(previousLogoUrl) || !previousLogoUrl.StartsWith("/uploads/logos/", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        var fileName = Path.GetFileName(previousLogoUrl);
        var fullPath = Path.Combine(webRoot, "uploads", "logos", fileName);
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
    }
}
