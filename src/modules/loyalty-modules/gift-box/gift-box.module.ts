import { Module } from "@nestjs/common";
import { GiftBoxController } from "./gift-box.controller";
import { GiftBoxService } from "./gift-box.service";

@Module({
  controllers: [GiftBoxController],
  providers: [GiftBoxService],
  exports: [GiftBoxService]
})
export class GiftBoxModule {}
