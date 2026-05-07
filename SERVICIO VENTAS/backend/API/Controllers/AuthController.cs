using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ServicioVentas.Application.DTOs.Auth;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Auth.Commands;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(ILoginHandler loginHandler) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto request)
    {
        var response = await loginHandler.Handle(new LoginCommand { Login = request });
        return Ok(response);
    }

    [Authorize]
    [HttpGet("me")]
    public ActionResult<CurrentUserDto> Me()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(ClaimTypes.Name)
            ?? throw new UnauthorizedAccessException("Usuario no autenticado.");

        if (!int.TryParse(userIdValue, out var userId))
        {
            throw new UnauthorizedAccessException("Token invalido.");
        }

        var nombreUsuario = User.FindFirstValue(ClaimTypes.Name)
            ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Token invalido.");

        var rol = User.FindFirstValue(ClaimTypes.Role)
            ?? throw new UnauthorizedAccessException("Token invalido.");

        return Ok(new CurrentUserDto
        {
            UsuarioId = userId,
            NombreUsuario = nombreUsuario,
            Rol = rol
        });
    }
}
