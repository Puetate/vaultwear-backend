import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

export function IsPositiveOrZero(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isPositiveOrZero",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === "number" && value >= 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a positive number or zero`;
        }
      }
    });
  };
}
