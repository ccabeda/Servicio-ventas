using AutoMapper;
using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.ICommand;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Configuraciones.Commands;

namespace ServicioVentas.Application.UseCases.Configuraciones.Handlers;

public class UpdateConfiguracionNegocioHandler(IMapper mapper, IConfiguracionNegocioRepositoryCommand commandRepo, IConfiguracionNegocioRepositoryQuery queryRepo) : IUpdateConfiguracionNegocioHandler
{
    public async Task<ConfiguracionNegocioDto> Handle(UpdateConfiguracionNegocioCommand command)
    {
        var configuracion = await queryRepo.GetByIdAsync(command.Id) ?? throw new KeyNotFoundException("Configuracion no encontrada.");
        mapper.Map(command.Configuracion, configuracion);

        await commandRepo.UpdateAsync(configuracion);
        await commandRepo.SaveChangesAsync();
        return mapper.Map<ConfiguracionNegocioDto>(configuracion);
    }
}
