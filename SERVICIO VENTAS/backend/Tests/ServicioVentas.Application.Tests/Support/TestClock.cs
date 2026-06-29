using ServicioVentas.Application.Services;

namespace ServicioVentas.Application.Tests.Support;

internal sealed class TestClock(DateTime utcNow) : IClock
{
    public DateTime UtcNow { get; } = utcNow;
    public DateTime LocalNow => UtcNow.ToLocalTime();
}
