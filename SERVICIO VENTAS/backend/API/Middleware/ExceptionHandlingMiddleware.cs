using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.Exceptions;

namespace ServicioVentas.API.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
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
            await HandleExceptionAsync(context, StatusCodes.Status409Conflict, "El recurso fue modificado por otra operacion. Intente nuevamente.");
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Se produjo una excepcion no controlada.");
            await HandleExceptionAsync(context, StatusCodes.Status500InternalServerError, exception.Message);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, int statusCode, string message)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        await context.Response.WriteAsync(JsonSerializer.Serialize(new { message }));
    }
}
