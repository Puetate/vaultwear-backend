import { Transform, TransformOptions } from "class-transformer";

export function TrimTransform(transformOptions?: TransformOptions) {
  return Transform(({ value }) => {
    return (value as string).trim();
  }, transformOptions);
}
