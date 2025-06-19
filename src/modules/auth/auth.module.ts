import { LoyaltyCardModule } from "@modules/loyalty-modules/loyalty-card/loyalty-card.module";
import { RewardModule } from "@modules/reward-modules/reward/reward.module";
import { PersonModule } from "@modules/user-modules/person/person.module";
import { RoleModule } from "@modules/user-modules/role/role.module";
import { UserModule } from "@modules/user-modules/user/user.module";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { jwtConfig } from "./config/jwt.config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { RefreshJwtStrategy } from "./strategies/refresh-jwt.strategy";

@Module({
  imports: [
    JwtModule.register(jwtConfig),
    UserModule,
    PersonModule,
    RoleModule,
    LoyaltyCardModule,
    RewardModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy]
})
export class AuthModule {}
