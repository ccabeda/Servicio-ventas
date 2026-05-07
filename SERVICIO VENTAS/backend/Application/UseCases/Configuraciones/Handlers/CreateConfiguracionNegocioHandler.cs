using AutoMapper;
using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.UseCases.Configuraciones.Commands;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Application.UseCases.Configuraciones.Handlers;

public class CreateConfiguracionNegocioHandler(IMapper mapper, IConfiguracionNegocioRepositoryCommand commandRepo) : ICreateConfiguracionNegocioHandler
{
    public async Task<ConfiguracionNegocioDto> Handle(CreateConfiguracionNegocioCommand command)
    {
        var configuracion = mapper.Map<ConfiguracionNegocio>(command.Configuracion);

        await commandRepo.AddAsync(configuracion);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<ConfiguracionNegocioDto>(configuracion);
    }
}
