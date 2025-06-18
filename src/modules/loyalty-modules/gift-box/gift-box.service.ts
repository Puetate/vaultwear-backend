import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { giftBox, loyaltyCard } from "@modules/drizzle/schema";
import { TransactionHost } from "@nestjs-cls/transactional";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { CreateGiftBoxDto } from "./dto/create-gift-box.dto";
import { UpdateGiftBoxDto } from "./dto/update-gift-box.dto";

@Injectable()
export class GiftBoxService {
  constructor(private readonly txHost: TransactionHost<DrizzleAdapter>) {}

  create(createGiftBoxDto: CreateGiftBoxDto) {
    return this.txHost.tx.insert(giftBox).values(createGiftBoxDto).returning();
  }

  findByUserID(userID: number) {
    return this.txHost.tx
      .select({
        giftBoxID: giftBox.giftBoxID,
        loyaltyCardID: giftBox.loyaltyCardID,
        status: giftBox.status
      })
      .from(giftBox)
      .innerJoin(loyaltyCard, eq(giftBox.loyaltyCardID, loyaltyCard.loyaltyCardID))
      .where(eq(loyaltyCard.userID, userID));
  }

  async findOne(giftBoxID: number) {
    const foundGiftBox = await this.txHost.tx.query.giftBox.findFirst({
      where: eq(giftBox.giftBoxID, giftBoxID)
    });
    if (!foundGiftBox) {
      throw new HttpException("La caja de regalo no existe", HttpStatus.NOT_FOUND);
    }
    return foundGiftBox;
  }

  async update(giftBoxID: number, updateGiftBoxDto: UpdateGiftBoxDto) {
    await this.findOne(giftBoxID);
    return this.txHost.tx
      .update(giftBox)
      .set(updateGiftBoxDto)
      .where(eq(giftBox.giftBoxID, giftBoxID))
      .returning();
  }

  async toggleStatus(giftBoxID: number) {
    const foundGiftBox = await this.findOne(giftBoxID);
    return this.update(giftBoxID, {
      status: !foundGiftBox.status
    });
  }
}
