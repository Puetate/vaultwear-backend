import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateGiftBoxDto } from "./dto/create-gift-box.dto";
import { UpdateGiftBoxDto } from "./dto/update-gift-box.dto";
import { GiftBoxService } from "./gift-box.service";

@ApiTags("GiftBox")
@ApiBearerAuth()
@Controller("gift-box")
export class GiftBoxController {
  constructor(private readonly giftBoxService: GiftBoxService) {}

  @Post()
  create(@Body() createGiftBoxDto: CreateGiftBoxDto) {
    return this.giftBoxService.create(createGiftBoxDto);
  }

  @Get("user/:userID")
  findByUserID(@Param("userID") userID: string) {
    return this.giftBoxService.findByUserID(+userID);
  }

  @Patch(":giftBoxID")
  update(@Param("giftBoxID") giftBoxID: string, @Body() updateGiftBoxDto: UpdateGiftBoxDto) {
    return this.giftBoxService.update(+giftBoxID, updateGiftBoxDto);
  }

  @Patch("toggle-status/:giftBoxID")
  toggleStatus(@Param("giftBoxID") giftBoxID: string) {
    return this.giftBoxService.toggleStatus(+giftBoxID);
  }
}
