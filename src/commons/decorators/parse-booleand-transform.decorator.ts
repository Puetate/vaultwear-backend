import { HttpException, HttpStatus } from "@nestjs/common";
import { Transform } from "class-transformer";

interface ParseBooleanTransformParams {
    isNullable?: boolean;
}

export function ParseBooleanTransform(params?: ParseBooleanTransformParams) {
    return Transform(({ value, key }) => {
        if (params?.isNullable && value === null) return value;
        if (typeof value === "boolean") return value;
        if (value === "true") return true;
        if (value === "false") return false;
        throw new HttpException(
            {
                error: "La solicitud no pudo ser procesada debido a datos inválidos.",
                message: `The ${key} must be a valid boolean`
            },
            HttpStatus.BAD_REQUEST
        );

    }
    );
}
