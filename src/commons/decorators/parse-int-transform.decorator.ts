import { HttpException, HttpStatus } from "@nestjs/common";
import { Transform } from "class-transformer";

interface ParseIntTransformParams {
  isNullable?: boolean;
}

export function ParseIntTransform(params?: ParseIntTransformParams) {
  return Transform(({ value, key }) => {
    if (params?.isNullable && value === null) return value;
    if (typeof value === "number") return value;
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue)) {
      throw new HttpException(
        {
          error: "La solicitud no pudo ser procesada debido a datos inválidos.",
          message: `The ${key} must be a valid number`
        },
        HttpStatus.BAD_REQUEST
      );
    }
    return parsedValue;
  });
}
