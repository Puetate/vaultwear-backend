import { dayjs } from "@commons/libs";
import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { loyaltyCard } from "@modules/drizzle/schema";
import { TransactionHost } from "@nestjs-cls/transactional";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { CreateGiftBoxDto } from "../gift-box/dto/create-gift-box.dto";
import { GiftBoxService } from "../gift-box/gift-box.service";
import { CreateLoyaltyCardDto } from "./dto/create-loyalty-card.dto";
import { UpdateLoyaltyCardDto } from "./dto/update-loyalty-card.dto";

@Injectable()
export class LoyaltyCardService {
  constructor(
    private readonly txHost: TransactionHost<DrizzleAdapter>,
    private readonly giftBoxService: GiftBoxService
  ) {}

  async create(createLoyaltyCardDto: CreateLoyaltyCardDto) {
    const foundLoyaltyCard = await this.findByUserID(createLoyaltyCardDto.userID);
    if (foundLoyaltyCard) {
      throw new HttpException("La carte de fidelidad ya existe para este usuario", HttpStatus.BAD_REQUEST);
    }
    return this.txHost.tx.insert(loyaltyCard).values(createLoyaltyCardDto).returning();
  }

  findByUserID(userID: number) {
    return this.txHost.tx.query.loyaltyCard.findFirst({
      where: eq(loyaltyCard.userID, userID)
    });
  }

  findAll() {
    return this.txHost.tx.query.loyaltyCard.findMany();
  }

  async findOne(loyaltyCardID: number) {
    const foundLoyaltyCard = await this.txHost.tx.query.loyaltyCard.findFirst({
      where: eq(loyaltyCard.loyaltyCardID, loyaltyCardID)
    });
    if (!foundLoyaltyCard) {
      throw new HttpException("La carte de fidelidad no existe", HttpStatus.NOT_FOUND);
    }
    return foundLoyaltyCard;
  }

  async claim(loyaltyCardID: number) {
    const foundLoyaltyCard = await this.findOne(loyaltyCardID);
    const quantityClaimed = foundLoyaltyCard.quantityClaimed;
    if (quantityClaimed === foundLoyaltyCard.quantity) {
      const detailDto: CreateGiftBoxDto = {
        loyaltyCardID: foundLoyaltyCard.loyaltyCardID,
        endDate: dayjs().toISOString()
      };
      await this.giftBoxService.create(detailDto);
      return this.update(loyaltyCardID, { quantityClaimed: 0 });
    }
    const newQuantityClaimed = quantityClaimed + 1;
    return this.update(loyaltyCardID, { quantityClaimed: newQuantityClaimed });
  }

  async update(loyaltyCardID: number, updateLoyaltyCardDto: UpdateLoyaltyCardDto) {
    await this.findOne(loyaltyCardID);
    return this.txHost.tx
      .update(loyaltyCard)
      .set(updateLoyaltyCardDto)
      .where(eq(loyaltyCard.loyaltyCardID, loyaltyCardID))
      .returning();
  }

  async toggleStatus(loyaltyCardID: number) {
    const foundLoyaltyCard = await this.findOne(loyaltyCardID);
    return this.update(loyaltyCardID, { status: !foundLoyaltyCard.status });
  }
}
