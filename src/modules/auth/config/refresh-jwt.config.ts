import { envs } from "@commons/config";
import { JwtSignOptions } from "@nestjs/jwt";

export const refreshJwtConfig: JwtSignOptions = {
  secret: envs.REFRESH_JWT_SECRET,
  expiresIn: envs.REFRESH_JWT_EXPIRES_IN
};
