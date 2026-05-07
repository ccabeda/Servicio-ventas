using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Query;

public class MedioPagoRepositoryQuery(ServicioVentasDbContext context) : IMedioPagoRepositoryQuery
{
    public async Task<List<MedioPago>> GetAllAsync() => await context.MediosPago.AsNoTracking().OrderBy(x => x.Nombre).ToListAsync();
    public async Task<MedioPago?> GetByIdAsync(int id) => await context.MediosPago.FirstOrDefaultAsync(x => x.Id == id);
    public async Task<bool> ExistsByNombreAsync(string nombre, int? excludeId = null) =>
        await context.MediosPago.AnyAsync(x => x.Nombre == nombre && (!excludeId.HasValue || x.Id != excludeId.Value));
}
