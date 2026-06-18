namespace ServicioVentas.Application.Services;

public class ApplicationFile
{
    public string FileName { get; init; } = string.Empty;
    public string ContentType { get; init; } = string.Empty;
    public long Length { get; init; }
    public Func<Stream> OpenReadStream { get; init; } = null!;
}
