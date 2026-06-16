using AutoMapper;
using Microsoft.Extensions.Logging.Abstractions;
using ServicioVentas.Application.Mapping;

namespace ServicioVentas.Application.Tests.Support;

internal static class TestMapper
{
    public static IMapper Create()
    {
        var configuration = new MapperConfiguration(config => config.AddProfile<PosMappingProfile>(), NullLoggerFactory.Instance);
        return configuration.CreateMapper();
    }
}
