using ServicioVentas.Domain.Enums;

namespace ServicioVentas.Application.Security;

public static class PermisosSistema
{
    public const string ProductosVer = "Productos.Ver";
    public const string ProductosGestionar = "Productos.Gestionar";
    public const string StockAjustar = "Stock.Ajustar";
    public const string CajaOperar = "Caja.Operar";
    public const string VentasCrear = "Ventas.Crear";
    public const string VentasVer = "Ventas.Ver";
    public const string ClientesGestionar = "Clientes.Gestionar";
    public const string MediosPagoGestionar = "MediosPago.Gestionar";
    public const string UsuariosGestionar = "Usuarios.Gestionar";
    public const string ConfiguracionGestionar = "Configuracion.Gestionar";
    public const string ImpresorasGestionar = "Impresoras.Gestionar";
    public const string ReportesVer = "Reportes.Ver";
    public const string AuditoriaVer = "Auditoria.Ver";

    public static IReadOnlyList<string> Todos { get; } =
    [
        ProductosVer,
        ProductosGestionar,
        StockAjustar,
        CajaOperar,
        VentasCrear,
        VentasVer,
        ClientesGestionar,
        MediosPagoGestionar,
        UsuariosGestionar,
        ConfiguracionGestionar,
        ImpresorasGestionar,
        ReportesVer,
        AuditoriaVer
    ];

    public static IReadOnlyList<string> ParaRol(RolUsuario rol)
    {
        return rol is RolUsuario.Admin
            ? Todos
            :
            [
                ProductosVer,
                CajaOperar,
                VentasCrear,
                VentasVer,
                ReportesVer
            ];
    }
}
