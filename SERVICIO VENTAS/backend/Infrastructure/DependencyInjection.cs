using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.IUnitOfWork;
using ServicioVentas.Application.Services;
using ServicioVentas.Infrastructure.Persistence;
using ServicioVentas.Infrastructure.Repository.Command;
using ServicioVentas.Infrastructure.Repository.Query;
using ServicioVentas.Infrastructure.Services;
namespace ServicioVentas.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ServicioVentasDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IProductoRepositoryCommand, ProductoRepositoryCommand>();
        services.AddScoped<IAuditoriaEventoRepositoryCommand, AuditoriaEventoRepositoryCommand>();
        services.AddScoped<IAuditoriaEventoRepositoryQuery, AuditoriaEventoRepositoryQuery>();
        services.AddScoped<IProductoRepositoryQuery, ProductoRepositoryQuery>();
        services.AddScoped<IMovimientoStockRepositoryCommand, MovimientoStockRepositoryCommand>();
        services.AddScoped<IMovimientoStockRepositoryQuery, MovimientoStockRepositoryQuery>();
        services.AddScoped<ICategoriaProductoRepositoryCommand, CategoriaProductoRepositoryCommand>();
        services.AddScoped<ICategoriaProductoRepositoryQuery, CategoriaProductoRepositoryQuery>();
        services.AddScoped<IMarcaProductoRepositoryCommand, MarcaProductoRepositoryCommand>();
        services.AddScoped<IMarcaProductoRepositoryQuery, MarcaProductoRepositoryQuery>();
        services.AddScoped<ICajaRepositoryCommand, CajaRepositoryCommand>();
        services.AddScoped<ICajaRepositoryQuery, CajaRepositoryQuery>();
        services.AddScoped<IClienteRepositoryCommand, ClienteRepositoryCommand>();
        services.AddScoped<IClienteRepositoryQuery, ClienteRepositoryQuery>();
        services.AddScoped<IMedioPagoRepositoryCommand, MedioPagoRepositoryCommand>();
        services.AddScoped<IMedioPagoRepositoryQuery, MedioPagoRepositoryQuery>();
        services.AddScoped<IImpuestoRepositoryCommand, ImpuestoRepositoryCommand>();
        services.AddScoped<IImpuestoRepositoryQuery, ImpuestoRepositoryQuery>();
        services.AddScoped<IConfiguracionNegocioRepositoryCommand, ConfiguracionNegocioRepositoryCommand>();
        services.AddScoped<IConfiguracionNegocioRepositoryQuery, ConfiguracionNegocioRepositoryQuery>();
        services.AddScoped<IConfiguracionTicketRepositoryCommand, ConfiguracionTicketRepositoryCommand>();
        services.AddScoped<IConfiguracionTicketRepositoryQuery, ConfiguracionTicketRepositoryQuery>();
        services.AddScoped<IImpresoraRepositoryCommand, ImpresoraRepositoryCommand>();
        services.AddScoped<IImpresoraRepositoryQuery, ImpresoraRepositoryQuery>();
        services.AddScoped<IUsuarioRepositoryCommand, UsuarioRepositoryCommand>();
        services.AddScoped<IUsuarioRepositoryQuery, UsuarioRepositoryQuery>();
        services.AddScoped<IVentaRepositoryCommand, VentaRepositoryCommand>();
        services.AddScoped<IVentaRepositoryQuery, VentaRepositoryQuery>();
        services.AddScoped<IReporteRepositoryQuery, ReporteRepositoryQuery>();
        services.AddScoped<IUnitOfWork, ServicioVentas.Infrastructure.UnitOfWork.UnitOfWork>();
        services.AddSingleton<IClock, SystemClock>();

        return services;
    }
}
