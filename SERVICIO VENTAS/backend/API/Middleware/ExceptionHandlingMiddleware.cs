using System.Text.Json;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.Exceptions;

namespace ServicioVentas.API.Middleware;

public class ExceptionHandlingMiddleware(
    RequestDelegate next,
    ILogger<ExceptionHandlingMiddleware> logger,
    IWebHostEnvironment environment)
{
    private static readonly Action<ILogger, Exception?> DatabaseException =
        LoggerMessage.Define(
            LogLevel.Error,
            new EventId(5001, nameof(DatabaseException)),
            "Se produjo una excepción de base de datos.");

    private static readonly Action<ILogger, Exception?> UnhandledException =
        LoggerMessage.Define(
            LogLevel.Error,
            new EventId(5002, nameof(UnhandledException)),
            "Se produjo una excepción no controlada.");

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

            DatabaseException(logger, exception);
            await HandleExceptionAsync(context, StatusCodes.Status409Conflict, message);
        }
        catch (Exception exception)
        {
            UnhandledException(logger, exception);
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
