using AutoMapper;
using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Configuraciones.Queries;

namespace ServicioVentas.Application.UseCases.Configuraciones.Handlers;

public class GetConfiguracionNegocioByIdHandler(IMapper mapper, IConfiguracionNegocioRepositoryQuery queryRepo) : IGetConfiguracionNegocioByIdHandler
{
    public async Task<ConfiguracionNegocioDto> Handle(GetConfiguracionNegocioByIdQuery query) => mapper.Map<ConfiguracionNegocioDto>(await queryRepo.GetByIdAsync(query.Id) ?? throw new KeyNotFoundException("Configuración no encontrada."));
}
