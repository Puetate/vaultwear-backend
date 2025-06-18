import { LoyaltyCardDetailModule } from "@modules/loyalty-modules/loyalty-card-detail/loyalty-card-detail.module";
import { Module } from "@nestjs/common";
import { OrderDetailController } from "./order-detail.controller";
import { OrderDetailService } from "./order-detail.service";

@Module({
  imports: [LoyaltyCardDetailModule],
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
  exports: [OrderDetailService]
})
export class OrderDetailModule {}
