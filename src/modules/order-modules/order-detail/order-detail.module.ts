import { Module } from "@nestjs/common";
import { OrderDetailController } from "./order-detail.controller";
import { OrderDetailService } from "./order-detail.service";

@Module({
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
  exports: [OrderDetailService]
})
export class OrderDetailModule {}
