import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { historicOrderDetail, orderDetail } from "@modules/drizzle/schema";
import { CreateLoyaltyCardDetailDto } from "@modules/loyalty-modules/loyalty-card-detail/dto/create-loyalty-card-detail.dto";
import { LoyaltyCardDetailService } from "@modules/loyalty-modules/loyalty-card-detail/loyalty-card-detail.service";
import { Transactional, TransactionHost } from "@nestjs-cls/transactional";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { CreateOrderDetailDto } from "./dto/create-order-detail.dto";
import { UpdateOrderDetailDto } from "./dto/update-order-detail.dto";

@Injectable()
export class OrderDetailService {
  constructor(
    private readonly txHost: TransactionHost<DrizzleAdapter>,
    private readonly loyaltyCardDetailService: LoyaltyCardDetailService
  ) {}

  @Transactional()
  async create(createOrderDetailDto: CreateOrderDetailDto) {
    const createOrderDetail = await this.txHost.tx
      .insert(orderDetail)
      .values(createOrderDetailDto)
      .returning();
    await this.txHost.tx
      .insert(historicOrderDetail)
      .values({ ...createOrderDetailDto, historicType: "CREADO" });
    const loyaltyCardDetailDto: CreateLoyaltyCardDetailDto = {
      orderDetailID: createOrderDetail[0].orderDetailID
    };
    await this.loyaltyCardDetailService.create(loyaltyCardDetailDto);
    return createOrderDetail;
  }

  async findOne(orderDetailID: number) {
    const foundOrderDetail = await this.txHost.tx.query.orderDetail.findFirst({
      where: eq(orderDetail.orderDetailID, orderDetailID)
    });
    if (!foundOrderDetail) {
      throw new HttpException("Detalle de orden no encontrado", HttpStatus.NOT_FOUND);
    }

    return foundOrderDetail;
  }

  findByOrder(orderID: number) {
    return this.txHost.tx.query.orderDetail.findMany({
      where: eq(orderDetail.orderID, orderID)
    });
  }

  findHistoricByOrderDetail(orderDetailID: number) {
    return this.txHost.tx.query.historicOrderDetail.findMany({
      where: eq(historicOrderDetail.orderDetailID, orderDetailID)
    });
  }

  async findByCode(orderDetailCode: string) {
    const foundDetail = await this.txHost.tx
      .select({
        contents: orderDetail.contents
      })
      .from(orderDetail)
      .where(eq(orderDetail.orderDetailCode, orderDetailCode))
      .limit(1);

    if (foundDetail.length > 0) {
      return foundDetail[0].contents;
    }
    return null;
  }

  async update(orderDetailID: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    await this.findOne(orderDetailID);
    const updatedOrderDetail = await this.txHost.tx
      .update(orderDetail)
      .set(updateOrderDetailDto)
      .where(eq(orderDetail.orderDetailID, orderDetailID))
      .returning();
    await this.txHost.tx
      .insert(historicOrderDetail)
      .values({ ...updatedOrderDetail[0], historicType: "ACTUALIZADO`" });
    return updatedOrderDetail;
  }

  async toggleStatus(orderDetailID: number) {
    const foundOrderDetail = await this.findOne(orderDetailID);
    return this.update(orderDetailID, { status: !foundOrderDetail.status });
  }
}
