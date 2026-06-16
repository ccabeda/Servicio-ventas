using FluentValidation;
using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Domain.Enums;

namespace ServicioVentas.Application.Validations.Cajas;

public class AbrirCajaDtoValidator : AbstractValidator<AbrirCajaDto>
{
    public AbrirCajaDtoValidator()
    {
        RuleFor(x => x.MontoInicial)
            .GreaterThanOrEqualTo(0).WithMessage("El monto inicial no puede ser negativo.");
    }
}

public class CerrarCajaDtoValidator : AbstractValidator<CerrarCajaDto>
{
    public CerrarCajaDtoValidator()
    {
        RuleFor(x => x.MontoFinal)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.MotivoCierre)
            .MaximumLength(300)
            .When(x => !string.IsNullOrWhiteSpace(x.MotivoCierre));
    }
}

public class RegistrarMovimientoCajaDtoValidator : AbstractValidator<RegistrarMovimientoCajaDto>
{
    public RegistrarMovimientoCajaDtoValidator()
    {
        RuleFor(x => x.Monto)
            .GreaterThan(0).WithMessage("El monto del movimiento debe ser mayor a cero.");

        RuleFor(x => x.Concepto)
            .NotEmpty().WithMessage("El concepto del movimiento es obligatorio.")
            .MaximumLength(200);

        RuleFor(x => x.Tipo)
            .Must(x => x is not TipoMovimientoCaja.Apertura and not TipoMovimientoCaja.Cierre)
            .WithMessage("Ese tipo de movimiento no se registra manualmente.");
    }
}
