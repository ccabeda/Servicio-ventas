using FluentValidation;
using ServicioVentas.Application.DTOs.MediosPago;

namespace ServicioVentas.Application.Validations.MediosPago;

public class CreateMedioPagoDtoValidator : AbstractValidator<CreateMedioPagoDto>
{
    public CreateMedioPagoDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre del medio de pago es obligatorio.")
            .MaximumLength(100);
    }
}

public class UpdateMedioPagoDtoValidator : AbstractValidator<UpdateMedioPagoDto>
{
    public UpdateMedioPagoDtoValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre del medio de pago es obligatorio.")
            .MaximumLength(100);
    }
}
