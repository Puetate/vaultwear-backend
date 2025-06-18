import { Module } from "@nestjs/common";
import { GiftBoxModule } from "../gift-box/gift-box.module";
import { LoyaltyCardController } from "./loyalty-card.controller";
import { LoyaltyCardService } from "./loyalty-card.service";

@Module({
  imports: [GiftBoxModule],
  controllers: [LoyaltyCardController],
  providers: [LoyaltyCardService],
  exports: [LoyaltyCardService]
})
export class LoyaltyCardModule {}
