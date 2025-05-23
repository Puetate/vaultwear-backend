import { PassportStrategy } from "@nestjs/passport";
import { FastifyRequest } from "fastify";
import { Strategy } from "passport-jwt";
import { refreshJwtConfig } from "../config/refresh-jwt.config";
import { AuthJwtPayload } from "../types/auth-jwt-payload.type";

function extractJwtFromCookie(req: FastifyRequest) {
  const token = req.cookies["refresh-token"];
  if (!token) {
    return null;
  }
  return token;
}

export class RefreshJwtStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
  constructor() {
    super({
      jwtFromRequest: extractJwtFromCookie,
      secretOrKey: refreshJwtConfig.secret!
    });
  }

  async validate(payload: AuthJwtPayload) {
    return { userID: payload.userID };
  }
}
