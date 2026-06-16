using AutoMapper;
using ServicioVentas.Application.DTOs.Productos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Productos.Commands;
using ServicioVentas.Application.UseCases.Productos.Queries;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Productos.Handlers;

public class CreateMarcaProductoHandler(
    IMapper mapper,
    IMarcaProductoRepositoryCommand commandRepo,
    IMarcaProductoRepositoryQuery queryRepo) : ICreateMarcaProductoHandler
{
    public async Task<MarcaProductoDto> Handle(CreateMarcaProductoCommand command)
    {
        var request = command.Marca;
        var nombre = request.Nombre.Trim();
        var existente = await queryRepo.GetByNombreAsync(nombre);

        if (existente is not null && existente.Activa)
            throw new InvalidOperationException("Ya existe una marca con ese nombre.");

        if (existente is not null)
        {
            existente.Nombre = nombre;
            existente.Activa = true;
            await commandRepo.UpdateAsync(existente);
            await commandRepo.SaveChangesAsync();
            return mapper.Map<MarcaProductoDto>(existente);
        }

        var marca = mapper.Map<MarcaProducto>(request);
        marca.Nombre = nombre;
        await commandRepo.AddAsync(marca);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<MarcaProductoDto>(marca);
    }
}

public class UpdateMarcaProductoHandler(
    IMapper mapper,
    IMarcaProductoRepositoryCommand commandRepo,
    IMarcaProductoRepositoryQuery queryRepo) : IUpdateMarcaProductoHandler
{
    public async Task<MarcaProductoDto> Handle(UpdateMarcaProductoCommand command)
    {
        var marca = await queryRepo.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException("Marca no encontrada.");
        var nombre = command.Marca.Nombre.Trim();

        if (await queryRepo.ExistsByNombreAsync(nombre, marca.Id))
            throw new InvalidOperationException("Ya existe una marca con ese nombre.");

        mapper.Map(command.Marca, marca);
        await commandRepo.UpdateAsync(marca);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<MarcaProductoDto>(marca);
    }
}

public class DeleteMarcaProductoHandler(
    IMarcaProductoRepositoryCommand commandRepo,
    IMarcaProductoRepositoryQuery queryRepo) : IDeleteMarcaProductoHandler
{
    public async Task Handle(DeleteMarcaProductoCommand command)
    {
        var marca = await queryRepo.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException("Marca no encontrada.");
        marca.Activa = false;
        await commandRepo.UpdateAsync(marca);
        await commandRepo.SaveChangesAsync();
    }
}

public class GetMarcasProductoHandler(IMapper mapper, IMarcaProductoRepositoryQuery queryRepo) : IGetMarcasProductoHandler
{
    public async Task<List<MarcaProductoDto>> Handle(GetMarcasProductoQuery query)
    {
        return mapper.Map<List<MarcaProductoDto>>(await queryRepo.GetAllAsync());
    }
}

public class GetMarcaProductoByIdHandler(IMapper mapper, IMarcaProductoRepositoryQuery queryRepo) : IGetMarcaProductoByIdHandler
{
    public async Task<MarcaProductoDto> Handle(GetMarcaProductoByIdQuery query)
    {
        var marca = await queryRepo.GetByIdAsync(query.Id) ?? throw new KeyNotFoundException("Marca no encontrada.");
        return mapper.Map<MarcaProductoDto>(marca);
    }
}
