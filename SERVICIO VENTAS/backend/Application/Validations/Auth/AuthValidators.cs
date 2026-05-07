using FluentValidation;
using ServicioVentas.Application.DTOs.Auth;

namespace ServicioVentas.Application.Validations.Auth;

public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.NombreUsuario)
            .NotEmpty().WithMessage("El nombre de usuario es obligatorio.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("La password es obligatoria.");
    }
}
