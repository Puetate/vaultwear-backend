import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";
import { DrizzleModule } from "@modules/drizzle/drizzle.module";
import { Drizzle } from "@modules/drizzle/drizzle.provider";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterDrizzleOrm } from "@nestjs-cls/transactional-adapter-drizzle-orm";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ClsModule } from "nestjs-cls";
import { AuthModule } from "./modules/auth/auth.module";
import { GiftBoxModule } from "./modules/loyalty-modules/gift-box/gift-box.module";
import { LoyaltyCardDetailModule } from "./modules/loyalty-modules/loyalty-card-detail/loyalty-card-detail.module";
import { LoyaltyCardModule } from "./modules/loyalty-modules/loyalty-card/loyalty-card.module";
import { ContentTypeModule } from "./modules/order-modules/content-type/content-type.module";
import { OrderDetailModule } from "./modules/order-modules/order-detail/order-detail.module";
import { OrderModule } from "./modules/order-modules/order/order.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { PersonModule } from "./modules/user-modules/person/person.module";
import { RoleModule } from "./modules/user-modules/role/role.module";
import { UserModule } from "./modules/user-modules/user/user.module";

@Module({
  imports: [
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [DrizzleModule],
          adapter: new TransactionalAdapterDrizzleOrm({
            drizzleInstanceToken: Drizzle
          })
        })
      ]
    }),
    AuthModule,
    UserModule,
    PersonModule,
    RoleModule,
    OrderModule,
    OrderDetailModule,
    ContentTypeModule,
    ReportsModule,
    LoyaltyCardModule,
    LoyaltyCardDetailModule,
    GiftBoxModule
  ],
  controllers: [],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}
