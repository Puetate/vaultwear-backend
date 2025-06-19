import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FastifyReply } from "fastify";
import { AuthService } from "./auth.service";
import { Public } from "./decorators";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RefreshAuthGuard } from "./guards/refresh-auth.guard";
import { AuthRequest } from "./types/auth-request.type";

@ApiTags("Auth")
@ApiBearerAuth()
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: FastifyReply) {
    return this.authService.login(loginDto, res);
  }

  @Public()
  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Put("register")
  updateRegister(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Get("refresh-token")
  refreshToken(@Req() req: AuthRequest) {
    return this.authService.refreshToken(req.user.userID);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post("sign-out")
  singOut(@Req() req: AuthRequest, @Res({ passthrough: true }) res: FastifyReply) {
    return this.authService.singOut(req.user.userID, res);
  }

  @Get("me")
  me(@Req() req: AuthRequest) {
    return this.authService.me(req.user.userID);
  }
}
