namespace ServicioVentas.Application.Services;

public interface IClock
{
    DateTime UtcNow { get; }
    DateTime LocalNow { get; }
}
