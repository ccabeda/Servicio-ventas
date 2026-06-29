namespace ServicioVentas.Application.Tests.Support;

internal sealed class TestUnitOfWork : IUnitOfWork.IUnitOfWork
{
    public int SaveCount { get; private set; }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        SaveCount++;
        return Task.CompletedTask;
    }
}
