using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.API.Services;
using ServicioVentas.Application.DTOs.Auth;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Auth.Commands;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(ILoginHandler loginHandler, ICurrentUserService currentUser) : ControllerBase
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
        return Ok(new CurrentUserDto
        {
            UsuarioId = currentUser.UserId,
            NombreUsuario = currentUser.UserName,
            Rol = currentUser.Role,
            Permisos = currentUser.Permissions.ToList()
        });
    }
}
