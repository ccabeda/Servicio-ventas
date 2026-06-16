using AutoMapper;
using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Productos.Commands;
using ServicioVentas.Application.UseCases.Productos.Queries;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Productos.Handlers;

public class CreateCategoriaProductoHandler(
    IMapper mapper,
    ICategoriaProductoRepositoryCommand commandRepo,
    ICategoriaProductoRepositoryQuery queryRepo) : ICreateCategoriaProductoHandler
{
    public async Task<CategoriaProductoDto> Handle(CreateCategoriaProductoCommand command)
    {
        var request = command.Categoria;
        var nombre = request.Nombre.Trim();
        var existente = await queryRepo.GetByNombreAsync(nombre);

        if (existente is not null && existente.Activo)
            throw new InvalidOperationException("Ya existe una categoría con ese nombre.");

        if (existente is not null)
        {
            existente.Nombre = nombre;
            existente.Activo = true;
            await commandRepo.UpdateAsync(existente);
            await commandRepo.SaveChangesAsync();
            return mapper.Map<CategoriaProductoDto>(existente);
        }

        var categoria = mapper.Map<CategoriaProducto>(request);
        categoria.Nombre = nombre;
        await commandRepo.AddAsync(categoria);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<CategoriaProductoDto>(categoria);
    }
}

public class UpdateCategoriaProductoHandler(
    IMapper mapper,
    ICategoriaProductoRepositoryCommand commandRepo,
    ICategoriaProductoRepositoryQuery queryRepo) : IUpdateCategoriaProductoHandler
{
    public async Task<CategoriaProductoDto> Handle(UpdateCategoriaProductoCommand command)
    {
        var categoria = await queryRepo.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException("Categoría no encontrada.");
        var nombre = command.Categoria.Nombre.Trim();

        if (await queryRepo.ExistsByNombreAsync(nombre, categoria.Id))
            throw new InvalidOperationException("Ya existe una categoría con ese nombre.");

        mapper.Map(command.Categoria, categoria);
        categoria.Nombre = nombre;
        await commandRepo.UpdateAsync(categoria);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<CategoriaProductoDto>(categoria);
    }
}

public class DeleteCategoriaProductoHandler(
    ICategoriaProductoRepositoryCommand commandRepo,
    ICategoriaProductoRepositoryQuery queryRepo) : IDeleteCategoriaProductoHandler
{
    public async Task Handle(DeleteCategoriaProductoCommand command)
    {
        var categoria = await queryRepo.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException("Categoría no encontrada.");
        await commandRepo.DeleteAsync(categoria);
        await commandRepo.SaveChangesAsync();
    }
}

public class GetCategoriasProductoHandler(IMapper mapper, ICategoriaProductoRepositoryQuery queryRepo) : IGetCategoriasProductoHandler
{
    public async Task<List<CategoriaProductoDto>> Handle(GetCategoriasProductoQuery query)
    {
        return mapper.Map<List<CategoriaProductoDto>>(await queryRepo.GetAllAsync());
    }
}

public class GetCategoriaProductoByIdHandler(IMapper mapper, ICategoriaProductoRepositoryQuery queryRepo) : IGetCategoriaProductoByIdHandler
{
    public async Task<CategoriaProductoDto> Handle(GetCategoriaProductoByIdQuery query)
    {
        var categoria = await queryRepo.GetByIdAsync(query.Id) ?? throw new KeyNotFoundException("Categoría no encontrada.");
        return mapper.Map<CategoriaProductoDto>(categoria);
    }
}
