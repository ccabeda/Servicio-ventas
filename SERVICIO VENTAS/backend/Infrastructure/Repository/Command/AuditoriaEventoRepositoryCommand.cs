using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.Infrastructure.Repository.Command;

public class AuditoriaEventoRepositoryCommand(ServicioVentasDbContext context) : IAuditoriaEventoRepositoryCommand
{
    public async Task AddAsync(AuditoriaEvento evento) => await context.AuditoriaEventos.AddAsync(evento);
}
