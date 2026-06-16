using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.UseCases.Productos.Commands;
using ServicioVentas.Application.UseCases.Productos.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface ICreateMarcaProductoHandler
{
    Task<MarcaProductoDto> Handle(CreateMarcaProductoCommand command);
}

public interface IUpdateMarcaProductoHandler
{
    Task<MarcaProductoDto> Handle(UpdateMarcaProductoCommand command);
}

public interface IDeleteMarcaProductoHandler
{
    Task Handle(DeleteMarcaProductoCommand command);
}

public interface IGetMarcasProductoHandler
{
    Task<List<MarcaProductoDto>> Handle(GetMarcasProductoQuery query);
}

public interface IGetMarcaProductoByIdHandler
{
    Task<MarcaProductoDto> Handle(GetMarcaProductoByIdQuery query);
}
