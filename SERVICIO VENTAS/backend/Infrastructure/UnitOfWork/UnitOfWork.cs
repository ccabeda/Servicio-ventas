using ServicioVentas.Application.IUnitOfWork;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.UnitOfWork;

public class UnitOfWork(ServicioVentasDbContext context) : IUnitOfWork
{
    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await context.SaveChangesAsync(cancellationToken);
    }
}
