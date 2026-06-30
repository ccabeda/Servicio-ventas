using AutoMapper;
using ServicioVentas.Application.DTOs.Auditoria;
using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.DTOs.Clientes;
using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.DTOs.Impuestos;
using ServicioVentas.Application.DTOs.MediosPago;
using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.DTOs.Usuarios;
using ServicioVentas.Application.DTOs.Ventas;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.Mapping;

public class PosMappingProfile : Profile
{
    public PosMappingProfile()
    {
        CreateMap<Producto, ProductoDto>()
            .ForMember(dest => dest.Categoria, opt => opt.MapFrom(src => src.Categoria != null ? src.Categoria.Nombre : null))
            .ForMember(dest => dest.Marca, opt => opt.MapFrom(src => src.Marca != null ? src.Marca.Nombre : null))
            .ForMember(dest => dest.ImpuestoNombre, opt => opt.MapFrom(src => src.Impuesto != null ? src.Impuesto.Nombre : null))
            .ForMember(dest => dest.ImpuestoPorcentaje, opt => opt.MapFrom(src => src.Impuesto != null ? src.Impuesto.Porcentaje : (decimal?)null));
        CreateMap<CreateProductoDto, Producto>()
            .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre.Trim()))
            .ForMember(dest => dest.CodigoBarra, opt => opt.MapFrom(src => Normalize(src.CodigoBarra)))
            .ForMember(dest => dest.CodigoInterno, opt => opt.MapFrom(src => Normalize(src.CodigoInterno)));
        CreateMap<UpdateProductoDto, Producto>()
            .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre.Trim()))
            .ForMember(dest => dest.CodigoBarra, opt => opt.MapFrom(src => Normalize(src.CodigoBarra)))
            .ForMember(dest => dest.CodigoInterno, opt => opt.MapFrom(src => Normalize(src.CodigoInterno)));

        CreateMap<Caja, CajaDto>();
        CreateMap<MovimientoCaja, MovimientoCajaDto>();

        CreateMap<Cliente, ClienteDto>();
        CreateMap<CreateClienteDto, Cliente>()
            .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre.Trim()))
            .ForMember(dest => dest.Telefono, opt => opt.MapFrom(src => Normalize(src.Telefono)));
        CreateMap<UpdateClienteDto, Cliente>()
            .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre.Trim()))
            .ForMember(dest => dest.Telefono, opt => opt.MapFrom(src => Normalize(src.Telefono)));

        CreateMap<MedioPago, MedioPagoDto>();
        CreateMap<CreateMedioPagoDto, MedioPago>()
            .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre.Trim()));
        CreateMap<UpdateMedioPagoDto, MedioPago>()
            .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre.Trim()));

        CreateMap<Impuesto, ImpuestoDto>();
        CreateMap<CreateImpuestoDto, Impuesto>()
            .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre.Trim()));
        CreateMap<UpdateImpuestoDto, Impuesto>()
            .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre.Trim()));

        CreateMap<CategoriaProducto, CategoriaProductoDto>();
        CreateMap<CreateCategoriaProductoDto, CategoriaProducto>()
            .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre.Trim()))
            .ForMember(dest => dest.Icono, opt => opt.MapFrom(src => Normalize(src.Icono)))
            .ForMember(dest => dest.Color, opt => opt.MapFrom(src => Normalize(src.Color)));
        CreateMap<UpdateCategoriaProductoDto, CategoriaProducto>()
            .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre.Trim()))
            .ForMember(dest => dest.Icono, opt => opt.MapFrom(src => Normalize(src.Icono)))
            .ForMember(dest => dest.Color, opt => opt.MapFrom(src => Normalize(src.Color)));

        CreateMap<MarcaProducto, MarcaProductoDto>();
        CreateMap<CreateMarcaProductoDto, MarcaProducto>()
            .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre.Trim()));
        CreateMap<UpdateMarcaProductoDto, MarcaProducto>()
            .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre.Trim()));
        CreateMap<MovimientoStock, MovimientoStockDto>()
            .ForMember(dest => dest.ProductoNombre, opt => opt.MapFrom(src => src.Producto.Nombre))
            .ForMember(dest => dest.UsuarioNombre, opt => opt.MapFrom(src => src.Usuario.NombreUsuario));

        CreateMap<ConfiguracionNegocio, ConfiguracionNegocioDto>();
        CreateMap<ConfiguracionTicket, ConfiguracionTicketDto>();
        CreateMap<UpdateConfiguracionTicketDto, ConfiguracionTicket>()
            .ForMember(dest => dest.ImpresoraNombreSistema, opt => opt.MapFrom(src => Normalize(src.ImpresoraNombreSistema)))
            .ForMember(dest => dest.MensajeTicket, opt => opt.MapFrom(src => Normalize(src.MensajeTicket)));
        CreateMap<Impresora, ImpresoraDto>();
        CreateMap<CreateImpresoraDto, Impresora>()
            .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre.Trim()))
            .ForMember(dest => dest.NombreSistema, opt => opt.MapFrom(src => src.NombreSistema.Trim()))
            .ForMember(dest => dest.Modelo, opt => opt.MapFrom(src => Normalize(src.Modelo)))
            .ForMember(dest => dest.Conexion, opt => opt.MapFrom(src => Normalize(src.Conexion)))
            .ForMember(dest => dest.Puerto, opt => opt.MapFrom(src => Normalize(src.Puerto)));
        CreateMap<UpdateImpresoraDto, Impresora>()
            .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre.Trim()))
            .ForMember(dest => dest.NombreSistema, opt => opt.MapFrom(src => src.NombreSistema.Trim()))
            .ForMember(dest => dest.Modelo, opt => opt.MapFrom(src => Normalize(src.Modelo)))
            .ForMember(dest => dest.Conexion, opt => opt.MapFrom(src => Normalize(src.Conexion)))
            .ForMember(dest => dest.Puerto, opt => opt.MapFrom(src => Normalize(src.Puerto)));
        CreateMap<CreateConfiguracionNegocioDto, ConfiguracionNegocio>()
            .ForMember(dest => dest.NombreNegocio, opt => opt.MapFrom(src => src.NombreNegocio.Trim()))
            .ForMember(dest => dest.Direccion, opt => opt.MapFrom(src => Normalize(src.Direccion)))
            .ForMember(dest => dest.Telefono, opt => opt.MapFrom(src => Normalize(src.Telefono)))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => Normalize(src.Email)))
            .ForMember(dest => dest.DiasAtencion, opt => opt.MapFrom(src => Normalize(src.DiasAtencion)))
            .ForMember(dest => dest.HorarioApertura, opt => opt.MapFrom(src => Normalize(src.HorarioApertura)))
            .ForMember(dest => dest.HorarioCierre, opt => opt.MapFrom(src => Normalize(src.HorarioCierre)))
            .ForMember(dest => dest.LogoUrl, opt => opt.MapFrom(src => Normalize(src.LogoUrl)))
            .ForMember(dest => dest.ColorPrincipal, opt => opt.MapFrom(src => NormalizeColor(src.ColorPrincipal)))
            .ForMember(dest => dest.RedondeoTotal, opt => opt.MapFrom(src => NormalizeRedondeo(src.RedondeoTotal)))
            .ForMember(dest => dest.FormatoFecha, opt => opt.MapFrom(src => NormalizeFormatoFecha(src.FormatoFecha)))
            .ForMember(dest => dest.FormatoHora, opt => opt.MapFrom(src => NormalizeFormatoHora(src.FormatoHora)));
        CreateMap<UpdateConfiguracionNegocioDto, ConfiguracionNegocio>()
            .ForMember(dest => dest.NombreNegocio, opt => opt.MapFrom(src => src.NombreNegocio.Trim()))
            .ForMember(dest => dest.Direccion, opt => opt.MapFrom(src => Normalize(src.Direccion)))
            .ForMember(dest => dest.Telefono, opt => opt.MapFrom(src => Normalize(src.Telefono)))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => Normalize(src.Email)))
            .ForMember(dest => dest.DiasAtencion, opt => opt.MapFrom(src => Normalize(src.DiasAtencion)))
            .ForMember(dest => dest.HorarioApertura, opt => opt.MapFrom(src => Normalize(src.HorarioApertura)))
            .ForMember(dest => dest.HorarioCierre, opt => opt.MapFrom(src => Normalize(src.HorarioCierre)))
            .ForMember(dest => dest.LogoUrl, opt => opt.MapFrom(src => Normalize(src.LogoUrl)))
            .ForMember(dest => dest.ColorPrincipal, opt => opt.MapFrom(src => NormalizeColor(src.ColorPrincipal)))
            .ForMember(dest => dest.RedondeoTotal, opt => opt.MapFrom(src => NormalizeRedondeo(src.RedondeoTotal)))
            .ForMember(dest => dest.FormatoFecha, opt => opt.MapFrom(src => NormalizeFormatoFecha(src.FormatoFecha)))
            .ForMember(dest => dest.FormatoHora, opt => opt.MapFrom(src => NormalizeFormatoHora(src.FormatoHora)));

        CreateMap<Usuario, UsuarioDto>();

        CreateMap<VentaDetalle, VentaDetalleDto>()
            .ForMember(dest => dest.ProductoNombre, opt => opt.MapFrom(src => src.Producto.Nombre));
        CreateMap<Venta, VentaDto>()
            .ForMember(dest => dest.Detalles, opt => opt.MapFrom(src => src.Detalles));

        CreateMap<AuditoriaEvento, AuditoriaEventoDto>()
            .ForMember(dest => dest.UsuarioNombre, opt => opt.MapFrom(src => src.Usuario != null ? src.Usuario.NombreUsuario : null));
    }

    private static string? Normalize(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static string NormalizeColor(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? "#ef0000" : value.Trim().ToLowerInvariant();
    }

    private static string NormalizeRedondeo(string? value)
    {
        return value is "0" or "0.05" or "1.00" ? value : "0.05";
    }

    private static string NormalizeFormatoFecha(string? value)
    {
        return value is "dd/MM/yyyy" or "MM/dd/yyyy" or "yyyy-MM-dd" ? value : "dd/MM/yyyy";
    }

    private static string NormalizeFormatoHora(string? value)
    {
        return value is "12" or "24" ? value : "24";
    }
}
