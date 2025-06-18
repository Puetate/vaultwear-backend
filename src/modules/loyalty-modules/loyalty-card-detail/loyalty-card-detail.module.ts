import { Module } from "@nestjs/common";
import { LoyaltyCardDetailController } from "./loyalty-card-detail.controller";
import { LoyaltyCardDetailService } from "./loyalty-card-detail.service";

@Module({
  controllers: [LoyaltyCardDetailController],
  providers: [LoyaltyCardDetailService],
  exports: [LoyaltyCardDetailService]
})
export class LoyaltyCardDetailModule {}
