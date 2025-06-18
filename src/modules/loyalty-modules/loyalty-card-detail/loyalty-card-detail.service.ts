import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { loyaltyCardDetail } from "@modules/drizzle/schema";
import { TransactionHost } from "@nestjs-cls/transactional";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { CreateLoyaltyCardDetailDto } from "./dto/create-loyalty-card-detail.dto";
import { UpdateLoyaltyCardDetailDto } from "./dto/update-loyalty-card-detail.dto";

@Injectable()
export class LoyaltyCardDetailService {
  constructor(private readonly txHost: TransactionHost<DrizzleAdapter>) {}

  async create(createLoyaltyCardDetailDto: CreateLoyaltyCardDetailDto) {
    await this.checkUnique(createLoyaltyCardDetailDto.orderDetailID);
    const foundLoyaltyCardDetail = await this.findByOrderDetailID(createLoyaltyCardDetailDto.orderDetailID);
    if (foundLoyaltyCardDetail) {
      throw new HttpException(
        "Ya existe un detalle de tarjeta de fidelidad para este pedido",
        HttpStatus.BAD_REQUEST
      );
    }
    const claimCode = crypto.randomUUID();
    return this.txHost.tx
      .insert(loyaltyCardDetail)
      .values({ ...createLoyaltyCardDetailDto, claimCode })
      .returning();
  }

  async checkUnique(orderDetailID: number) {
    const foundLoyaltyCardDetail = await this.findByOrderDetailID(orderDetailID);
    if (foundLoyaltyCardDetail) {
      throw new HttpException(
        "Ya existe un detalle de tarjeta de fidelidad para este pedido",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  findByOrderDetailID(orderDetailID: number) {
    return this.txHost.tx.query.loyaltyCardDetail.findFirst({
      where: eq(loyaltyCardDetail.orderDetailID, orderDetailID)
    });
  }

  async findOne(loyaltyCardDetailID: number) {
    const foundLoyaltyCardDetail = await this.txHost.tx.query.loyaltyCardDetail.findFirst({
      where: eq(loyaltyCardDetail.loyaltyCardDetailID, loyaltyCardDetailID)
    });
    if (!foundLoyaltyCardDetail) {
      throw new HttpException("El detalle de la tarjeta de fidelidad no existe", HttpStatus.NOT_FOUND);
    }
    return foundLoyaltyCardDetail;
  }

  async update(loyaltyCardDetailID: number, updateLoyaltyCardDetailDto: UpdateLoyaltyCardDetailDto) {
    await this.findOne(loyaltyCardDetailID);
    return this.txHost.tx
      .update(loyaltyCardDetail)
      .set(updateLoyaltyCardDetailDto)
      .where(eq(loyaltyCardDetail.loyaltyCardDetailID, loyaltyCardDetailID))
      .returning();
  }
}
