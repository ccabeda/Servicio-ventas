using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class VentaRepositoryQuery(ServicioVentasDbContext context) : IVentaRepositoryQuery
{
    public async Task<List<Venta>> GetAllAsync()
    {
        return await context.Ventas
            .AsNoTracking()
            .Include(x => x.Detalles)
            .ThenInclude(x => x.Producto)
            .OrderByDescending(x => x.Fecha)
            .ToListAsync();
    }

    public async Task<Venta?> GetByIdAsync(int id)
    {
        return await context.Ventas
            .AsNoTracking()
            .Include(x => x.Detalles)
            .ThenInclude(x => x.Producto)
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}
