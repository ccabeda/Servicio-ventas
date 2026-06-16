using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.UseCases.Productos.Commands;
using ServicioVentas.Application.UseCases.Productos.Queries;

namespace ServicioVentas.Application.IHandlers;

public interface ICreateCategoriaProductoHandler
{
    Task<CategoriaProductoDto> Handle(CreateCategoriaProductoCommand command);
}

public interface IUpdateCategoriaProductoHandler
{
    Task<CategoriaProductoDto> Handle(UpdateCategoriaProductoCommand command);
}

public interface IDeleteCategoriaProductoHandler
{
    Task Handle(DeleteCategoriaProductoCommand command);
}

public interface IGetCategoriasProductoHandler
{
    Task<List<CategoriaProductoDto>> Handle(GetCategoriasProductoQuery query);
}

public interface IGetCategoriaProductoByIdHandler
{
    Task<CategoriaProductoDto> Handle(GetCategoriaProductoByIdQuery query);
}
