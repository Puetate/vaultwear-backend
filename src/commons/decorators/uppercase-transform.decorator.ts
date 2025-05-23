import { Transform, TransformOptions } from "class-transformer";

export function UppercaseTransform(transformOptions?: TransformOptions) {
  return Transform(({ value }) => {
    return (value as string).toUpperCase().trim()
  }, transformOptions);
}
