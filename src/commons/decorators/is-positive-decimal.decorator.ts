import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { Decimal } from "decimal.js";

export function IsPositiveDecimal(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isPositiveDecimal",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const numericValue = new Decimal(value);
          return numericValue.toNumber() >= 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a positive number or zero`;
        }
      }
    });
  };
}
