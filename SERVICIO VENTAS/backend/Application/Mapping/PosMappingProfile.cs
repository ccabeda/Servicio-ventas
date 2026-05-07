using AutoMapper;
using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.DTOs.Clientes;
using ServicioVentas.Application.DTOs.Configuraciones;
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
        CreateMap<Producto, ProductoDto>();
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

        CreateMap<ConfiguracionNegocio, ConfiguracionNegocioDto>();
        CreateMap<CreateConfiguracionNegocioDto, ConfiguracionNegocio>()
            .ForMember(dest => dest.NombreNegocio, opt => opt.MapFrom(src => src.NombreNegocio.Trim()))
            .ForMember(dest => dest.Direccion, opt => opt.MapFrom(src => Normalize(src.Direccion)))
            .ForMember(dest => dest.Telefono, opt => opt.MapFrom(src => Normalize(src.Telefono)))
            .ForMember(dest => dest.LogoUrl, opt => opt.MapFrom(src => Normalize(src.LogoUrl)))
            .ForMember(dest => dest.MensajeTicket, opt => opt.MapFrom(src => Normalize(src.MensajeTicket)))
            .ForMember(dest => dest.ImpresoraTicket, opt => opt.MapFrom(src => Normalize(src.ImpresoraTicket)));
        CreateMap<UpdateConfiguracionNegocioDto, ConfiguracionNegocio>()
            .ForMember(dest => dest.NombreNegocio, opt => opt.MapFrom(src => src.NombreNegocio.Trim()))
            .ForMember(dest => dest.Direccion, opt => opt.MapFrom(src => Normalize(src.Direccion)))
            .ForMember(dest => dest.Telefono, opt => opt.MapFrom(src => Normalize(src.Telefono)))
            .ForMember(dest => dest.LogoUrl, opt => opt.MapFrom(src => Normalize(src.LogoUrl)))
            .ForMember(dest => dest.MensajeTicket, opt => opt.MapFrom(src => Normalize(src.MensajeTicket)))
            .ForMember(dest => dest.ImpresoraTicket, opt => opt.MapFrom(src => Normalize(src.ImpresoraTicket)));

        CreateMap<Usuario, UsuarioDto>();

        CreateMap<VentaDetalle, VentaDetalleDto>()
            .ForMember(dest => dest.ProductoNombre, opt => opt.MapFrom(src => src.Producto.Nombre));
        CreateMap<Venta, VentaDto>()
            .ForMember(dest => dest.Detalles, opt => opt.MapFrom(src => src.Detalles));
    }

    private static string? Normalize(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
