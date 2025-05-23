import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { contentType, orderDetail } from "@modules/drizzle/schema";
import { TransactionHost } from "@nestjs-cls/transactional";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { CreateOrderDetailDto } from "./dto/create-order-detail.dto";
import { UpdateOrderDetailDto } from "./dto/update-order-detail.dto";

@Injectable()
export class OrderDetailService {
  constructor(private readonly txHost: TransactionHost<DrizzleAdapter>) {}

  create(createOrderDetailDto: CreateOrderDetailDto) {
    return this.txHost.tx.insert(orderDetail).values(createOrderDetailDto).returning();
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

  findByCode(orderDetailCode: string) {
    return this.txHost.tx
      .select({
        urlContent: orderDetail.urlContent,
        contentTypeName: contentType.contentTypeName
      })
      .from(orderDetail)
      .innerJoin(contentType, eq(orderDetail.contentTypeID, contentType.contentTypeID))
      .where(eq(orderDetail.orderDetailCode, orderDetailCode));
  }

  async update(orderDetailID: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    await this.findOne(orderDetailID);
    return this.txHost.tx
      .update(orderDetail)
      .set(updateOrderDetailDto)
      .where(eq(orderDetail.orderDetailID, orderDetailID))
      .returning();
  }

  async toggleStatus(orderDetailID: number) {
    const foundOrderDetail = await this.findOne(orderDetailID);
    return this.update(orderDetailID, { status: !foundOrderDetail.status });
  }
}
