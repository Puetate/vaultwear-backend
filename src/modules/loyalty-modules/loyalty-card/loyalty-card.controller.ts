import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateLoyaltyCardDto } from "./dto/create-loyalty-card.dto";
import { UpdateLoyaltyCardDto } from "./dto/update-loyalty-card.dto";
import { LoyaltyCardService } from "./loyalty-card.service";

@ApiTags("LoyaltyCard")
@ApiBearerAuth()
@Controller("loyalty-card")
export class LoyaltyCardController {
  constructor(private readonly loyaltyCardService: LoyaltyCardService) {}

  @Post()
  create(@Body() createLoyaltyCardDto: CreateLoyaltyCardDto) {
    return this.loyaltyCardService.create(createLoyaltyCardDto);
  }

  @Get("user/:userID")
  findByUserID(@Param("userID") userID: string) {
    return this.loyaltyCardService.findByUserID(+userID);
  }

  @Get()
  findAll() {
    return this.loyaltyCardService.findAll();
  }

  @Get(":loyaltyCardID")
  findOne(@Param("loyaltyCardID") loyaltyCardID: string) {
    return this.loyaltyCardService.findOne(+loyaltyCardID);
  }

  @Patch("claim/:loyaltyCardID")
  claim(@Param("loyaltyCardID") loyaltyCardID: string) {
    return this.loyaltyCardService.claim(+loyaltyCardID);
  }

  @Patch(":loyaltyCardID")
  update(@Param("loyaltyCardID") loyaltyCardID: string, @Body() updateLoyaltyCardDto: UpdateLoyaltyCardDto) {
    return this.loyaltyCardService.update(+loyaltyCardID, updateLoyaltyCardDto);
  }

  @Patch("toggle-status/:loyaltyCardID")
  toggleStatus(@Param("loyaltyCardID") loyaltyCardID: string) {
    return this.loyaltyCardService.toggleStatus(+loyaltyCardID);
  }
}
