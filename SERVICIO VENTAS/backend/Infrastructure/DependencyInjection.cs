using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.IUnitOfWork;
using ServicioVentas.Infrastructure.Persistence;
using ServicioVentas.Infrastructure.Repository.Command;
using ServicioVentas.Infrastructure.Repository.Query;
namespace ServicioVentas.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ServicioVentasDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IProductoRepositoryCommand, ProductoRepositoryCommand>();
        services.AddScoped<IProductoRepositoryQuery, ProductoRepositoryQuery>();
        services.AddScoped<ICajaRepositoryCommand, CajaRepositoryCommand>();
        services.AddScoped<ICajaRepositoryQuery, CajaRepositoryQuery>();
        services.AddScoped<IClienteRepositoryCommand, ClienteRepositoryCommand>();
        services.AddScoped<IClienteRepositoryQuery, ClienteRepositoryQuery>();
        services.AddScoped<IMedioPagoRepositoryCommand, MedioPagoRepositoryCommand>();
        services.AddScoped<IMedioPagoRepositoryQuery, MedioPagoRepositoryQuery>();
        services.AddScoped<IConfiguracionNegocioRepositoryCommand, ConfiguracionNegocioRepositoryCommand>();
        services.AddScoped<IConfiguracionNegocioRepositoryQuery, ConfiguracionNegocioRepositoryQuery>();
        services.AddScoped<IUsuarioRepositoryCommand, UsuarioRepositoryCommand>();
        services.AddScoped<IUsuarioRepositoryQuery, UsuarioRepositoryQuery>();
        services.AddScoped<IVentaRepositoryCommand, VentaRepositoryCommand>();
        services.AddScoped<IVentaRepositoryQuery, VentaRepositoryQuery>();
        services.AddScoped<IReporteRepositoryQuery, ReporteRepositoryQuery>();
        services.AddScoped<IUnitOfWork, ServicioVentas.Infrastructure.UnitOfWork.UnitOfWork>();

        return services;
    }
}
