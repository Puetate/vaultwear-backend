import { envs } from "@commons/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export const jwtConfig: JwtModuleOptions = {
  secret: envs.JWT_SECRET,
  signOptions: {
    expiresIn: envs.JWT_EXPIRES_IN
  }
};
