using FluentValidation;
using ServicioVentas.Application.DTOs.Clientes;

namespace ServicioVentas.Application.Validations.Clientes;

public class CreateClienteDtoValidator : AbstractValidator<CreateClienteDto>
{
    public CreateClienteDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre del cliente es obligatorio.")
            .MaximumLength(150);

        RuleFor(x => x.Telefono)
            .MaximumLength(30)
            .When(x => !string.IsNullOrWhiteSpace(x.Telefono));
    }
}

public class UpdateClienteDtoValidator : AbstractValidator<UpdateClienteDto>
{
    public UpdateClienteDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre del cliente es obligatorio.")
            .MaximumLength(150);

        RuleFor(x => x.Telefono)
            .MaximumLength(30)
            .When(x => !string.IsNullOrWhiteSpace(x.Telefono));
    }
}
