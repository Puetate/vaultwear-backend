import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConfig } from "../config/jwt.config";
import { AuthJwtPayload } from "../types/auth-jwt-payload.type";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret!
    });
  }

  async validate(payload: AuthJwtPayload) {
    return {
      userID: payload.userID,
      email: payload.email,
      role: payload.role
    };
  }
}
