import { PersonModule } from "@modules/user-modules/person/person.module";
import { Module } from "@nestjs/common";
import { OrderDetailModule } from "../order-detail/order-detail.module";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";

@Module({
  imports: [OrderDetailModule, PersonModule],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
