import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateLoyaltyCardDetailDto } from "./dto/create-loyalty-card-detail.dto";
import { UpdateLoyaltyCardDetailDto } from "./dto/update-loyalty-card-detail.dto";
import { LoyaltyCardDetailService } from "./loyalty-card-detail.service";

@ApiTags("LoyaltyCardDetail")
@ApiBearerAuth()
@Controller("loyalty-card-detail")
export class LoyaltyCardDetailController {
  constructor(private readonly loyaltyCardDetailService: LoyaltyCardDetailService) {}

  @Post()
  create(@Body() createLoyaltyCardDetailDto: CreateLoyaltyCardDetailDto) {
    return this.loyaltyCardDetailService.create(createLoyaltyCardDetailDto);
  }

  @Get(":loyaltyCardDetailID")
  findOne(@Param("loyaltyCardDetailID") loyaltyCardDetailID: string) {
    return this.loyaltyCardDetailService.findOne(+loyaltyCardDetailID);
  }

  @Patch(":loyaltyCardDetailID")
  update(
    @Param("loyaltyCardDetailID") loyaltyCardDetailID: string,
    @Body() updateLoyaltyCardDetailDto: UpdateLoyaltyCardDetailDto
  ) {
    return this.loyaltyCardDetailService.update(+loyaltyCardDetailID, updateLoyaltyCardDetailDto);
  }
}
