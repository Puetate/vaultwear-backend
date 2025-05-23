import { envs } from "@commons/config";
import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { UserService } from "@modules/user-modules/user/user.service";
import { TransactionHost } from "@nestjs-cls/transactional";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { FastifyReply } from "fastify";
import { refreshJwtConfig } from "./config/refresh-jwt.config";
import { LoginDto } from "./dto/login.dto";
import { AuthJwtPayload } from "./types/auth-jwt-payload.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly txHost: TransactionHost<DrizzleAdapter>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async login(loginDto: LoginDto, res: FastifyReply) {
    const foundUser = await this.userService.findByEmail(loginDto.email);
    if (!foundUser) {
      throw new HttpException("Usuario o contraseña incorrectos", HttpStatus.UNAUTHORIZED);
    }
    const { password, ...user } = foundUser;
    const isPasswordValid = await compare(loginDto.password, password);
    if (!isPasswordValid) {
      throw new HttpException("Usuario o contraseña incorrectos", HttpStatus.UNAUTHORIZED);
    }
    const payload: AuthJwtPayload = { userID: foundUser.userID };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, refreshJwtConfig);
    await this.userService.update(foundUser.userID, { refreshToken });
    res.setCookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: envs.NODE_ENV === "production",
      sameSite: envs.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 * 15
    });
    return {
      user,
      accessToken
    };
  }

  async refreshToken(userID: number) {
    const foundUser = await this.userService.findOne(userID);
    if (!foundUser) {
      throw new HttpException("Usuario no encontrado", HttpStatus.UNAUTHORIZED);
    }
    const payload: AuthJwtPayload = { userID: foundUser.userID };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async singOut(userID: number, res: FastifyReply) {
    const foundUser = await this.userService.findOne(userID);
    if (!foundUser) {
      throw new HttpException("Usuario no encontrado", HttpStatus.UNAUTHORIZED);
    }
    this.userService.update(foundUser.userID, { refreshToken: null });
    res.setCookie("refresh-token", "");
    return true;
  }

  async me(userID: number) {
    const foundUser = await this.userService.findOne(userID);
    if (!foundUser) {
      throw new HttpException("Usuario no encontrado", HttpStatus.UNAUTHORIZED);
    }
    const payload: AuthJwtPayload = { userID: foundUser.userID };
    const accessToken = this.jwtService.sign(payload);
    return {
      user: foundUser,
      accessToken
    };
  }
}
