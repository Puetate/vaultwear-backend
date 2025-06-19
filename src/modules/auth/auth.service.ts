import { envs } from "@commons/config";
import { dayjs } from "@commons/libs";
import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { CreateLoyaltyCardDto } from "@modules/loyalty-modules/loyalty-card/dto/create-loyalty-card.dto";
import { LoyaltyCardService } from "@modules/loyalty-modules/loyalty-card/loyalty-card.service";
import { PersonService } from "@modules/user-modules/person/person.service";
import { RoleService } from "@modules/user-modules/role/role.service";
import { CreateUserWithPersonDto } from "@modules/user-modules/user/dto/create-with-person.dto";
import { UserService } from "@modules/user-modules/user/user.service";
import { Transactional, TransactionHost } from "@nestjs-cls/transactional";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { FastifyReply } from "fastify";
import { refreshJwtConfig } from "./config/refresh-jwt.config";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthJwtPayload } from "./types/auth-jwt-payload.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly txHost: TransactionHost<DrizzleAdapter>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly personService: PersonService,
    private readonly roleModule: RoleService,
    private readonly loyaltyCardService: LoyaltyCardService
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
    const payload: AuthJwtPayload = {
      userID: foundUser.userID,
      email: foundUser.email,
      role: foundUser.role
    };
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

  @Transactional()
  async register(registerDto: RegisterDto) {
    const { user, person } = registerDto;
    const createdPerson = await this.personService.create(person);
    const role = await this.roleModule.findByName("USER");
    if (!role || !createdPerson) {
      throw new HttpException("Error al crear el usuario", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const createUser: CreateUserWithPersonDto = {
      user: {
        ...user,
        roleID: role.roleID
      },
      person
    };
    const createdUser = await this.userService.createWithPerson(createUser);
    if (!createdUser) {
      throw new HttpException("Error al crear el usuario", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const loyaltyCardDto: CreateLoyaltyCardDto = {
      userID: createdUser.userID,
      startDate: dayjs().toISOString()
    };
    await this.loyaltyCardService.create(loyaltyCardDto);

    return { message: "Usuario registrado exitosamente" };
  }

  async refreshToken(userID: number) {
    const foundUser = await this.userService.findOne(userID);
    if (!foundUser) {
      throw new HttpException("Usuario no encontrado", HttpStatus.UNAUTHORIZED);
    }
    const payload: AuthJwtPayload = {
      userID: foundUser.userID,
      email: foundUser.email,
      role: foundUser.role
    };
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
    const payload: AuthJwtPayload = {
      userID: foundUser.userID,
      email: foundUser.email,
      role: foundUser.role
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      user: foundUser,
      accessToken
    };
  }
}
