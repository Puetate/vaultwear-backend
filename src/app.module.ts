import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";
import { DrizzleModule } from "@modules/drizzle/drizzle.module";
import { Drizzle } from "@modules/drizzle/drizzle.provider";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterDrizzleOrm } from "@nestjs-cls/transactional-adapter-drizzle-orm";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ClsModule } from "nestjs-cls";
import { AuthModule } from "./modules/auth/auth.module";
import { ContentTypeModule } from "./modules/order-modules/content-type/content-type.module";
import { OrderDetailModule } from "./modules/order-modules/order-detail/order-detail.module";
import { OrderModule } from "./modules/order-modules/order/order.module";
import { PersonModule } from "./modules/user-modules/person/person.module";
import { RoleModule } from "./modules/user-modules/role/role.module";
import { UserModule } from "./modules/user-modules/user/user.module";
import { ReportsModule } from './modules/reports/reports.module';

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
    ReportsModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}
