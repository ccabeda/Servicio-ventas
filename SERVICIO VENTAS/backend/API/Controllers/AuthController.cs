using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.Application.DTOs.Auth;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Auth.Commands;
using ServicioVentas.Application.UseCases.Auth.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    ILoginHandler loginHandler,
    IGetCurrentUserHandler getCurrentUserHandler,
    ICambiarPasswordHandler cambiarPasswordHandler) : ControllerBase
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
    public async Task<ActionResult<CurrentUserDto>> Me()
    {
        return Ok(await getCurrentUserHandler.Handle(new GetCurrentUserQuery()));
    }

    [Authorize]
    [HttpPost("cambiar-password")]
    public async Task<ActionResult<CurrentUserDto>> CambiarPassword([FromBody] CambiarPasswordDto request)
    {
        return Ok(await cambiarPasswordHandler.Handle(new CambiarPasswordCommand { Request = request }));
    }
}
