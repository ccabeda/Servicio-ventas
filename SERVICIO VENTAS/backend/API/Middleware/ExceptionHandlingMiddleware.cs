using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.Exceptions;

namespace ServicioVentas.API.Middleware;

public class ExceptionHandlingMiddleware(
    RequestDelegate next,
    ILogger<ExceptionHandlingMiddleware> logger,
    IWebHostEnvironment environment)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (KeyNotFoundException exception)
        {
            await HandleExceptionAsync(context, StatusCodes.Status404NotFound, exception.Message);
        }
        catch (InvalidOperationException exception)
        {
            await HandleExceptionAsync(context, StatusCodes.Status409Conflict, exception.Message);
        }
        catch (UnauthorizedAccessException exception)
        {
            await HandleExceptionAsync(context, StatusCodes.Status401Unauthorized, exception.Message);
        }
        catch (ForbiddenAccessException exception)
        {
            await HandleExceptionAsync(context, StatusCodes.Status403Forbidden, exception.Message);
        }
        catch (DbUpdateConcurrencyException)
        {
            await HandleExceptionAsync(context, StatusCodes.Status409Conflict, "El recurso fue modificado por otra operación. Intente nuevamente.");
        }
        catch (DbUpdateException exception)
        {
            var message = exception.InnerException is SqlException sqlException
                ? ObtenerMensajeDb(sqlException)
                : "No se pudieron guardar los cambios en la base de datos.";

            logger.LogError(exception, "Se produjo una excepción de base de datos.");
            await HandleExceptionAsync(context, StatusCodes.Status409Conflict, message);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Se produjo una excepción no controlada.");
            var message = environment.IsDevelopment()
                ? exception.Message
                : "Se produjo un error inesperado.";
            await HandleExceptionAsync(context, StatusCodes.Status500InternalServerError, message);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, int statusCode, string message)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var response = new ApiErrorDto
        {
            Message = message,
            Errors = [new ApiFieldErrorDto { Message = message }]
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }

    private static string ObtenerMensajeDb(SqlException exception)
    {
        if (exception.Number is 2601 or 2627)
            return "Ya existe una caja abierta. Cierra la caja actual antes de abrir otra.";

        if (exception.Number == 547)
            return "No se pudo guardar la operación por una relación inválida en la base de datos.";

        return "No se pudieron guardar los cambios en la base de datos.";
    }
}
