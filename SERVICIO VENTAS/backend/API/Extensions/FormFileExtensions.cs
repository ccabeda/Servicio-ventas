using ServicioVentas.Application.Services;

namespace ServicioVentas.API.Extensions;

public static class FormFileExtensions
{
    public static ApplicationFile? ToApplicationFile(this IFormFile? file)
    {
        return file is null
            ? null
            : new ApplicationFile
            {
                FileName = file.FileName,
                ContentType = file.ContentType,
                Length = file.Length,
                OpenReadStream = file.OpenReadStream
            };
    }
}
