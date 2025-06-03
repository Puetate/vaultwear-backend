import { PaginationDto } from "@commons/dto";
import { generatePaginatedFilteredData } from "@commons/utils";
import { jsonAgg } from "@commons/utils/json-agg.util";
import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { contentType, order, orderDetail, person } from "@modules/drizzle/schema";
import { PersonService } from "@modules/user-modules/person/person.service";
import { Transactional, TransactionHost } from "@nestjs-cls/transactional";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import Decimal from "decimal.js";
import { eq, sql } from "drizzle-orm";
import { CreateOrderDetailDto } from "../order-detail/dto/create-order-detail.dto";
import { OrderDetailService } from "../order-detail/order-detail.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CreateOrderWithDetailsDto } from "./dto/create-with-details.dto";
import { UpdateOrderWithDetailsDto } from "./dto/update-order-with-detail.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Injectable()
export class OrderService {
  constructor(
    private readonly txHost: TransactionHost<DrizzleAdapter>,
    private readonly orderDetailService: OrderDetailService,
    private readonly personService: PersonService
  ) {}

  create(createOrderDto: CreateOrderDto) {
    return this.txHost.tx.insert(order).values(createOrderDto).returning();
  }

  @Transactional()
  async createWithDetails(createOrderWithDetailsDto: CreateOrderWithDetailsDto) {
    const { order, details, person } = createOrderWithDetailsDto;
    let total = new Decimal(0);
    details.forEach((detail) => {
      const price = new Decimal(detail.price);
      const quantity = new Decimal(detail.quantity);
      total = total.add(price.times(quantity));
    });
    order.total = total.toString();
    let personID: number;
    if (person.personID) {
      personID = person.personID;
    } else {
      personID = (await this.personService.create(person))[0].personID;
    }
    order.personID = personID;
    const createOrder = await this.create(order);
    const detailsPromise: Promise<object>[] = [];
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      const createOrderDetailDto: CreateOrderDetailDto = {
        ...detail,
        orderID: createOrder[0].orderID
      };
      detailsPromise.push(this.orderDetailService.create(createOrderDetailDto));
    }
    await Promise.all(detailsPromise);
    return createOrder;
  }

  @Transactional()
  async updateWithDetails(updateOrderWithDetailsDto: UpdateOrderWithDetailsDto) {
    const { order, details } = updateOrderWithDetailsDto;
    let total = new Decimal(0);
    details.forEach((detail) => {
      const price = new Decimal(detail?.price);
      const quantity = new Decimal(detail?.quantity);
      total = total.add(price.times(quantity));
    });
    order.total = total.toString();
    const { orderID, ...orderDto } = order;
    const createOrder = await this.update(orderID, orderDto);
    const detailsPromise: Promise<object>[] = [];
    for (const detail of details) {
      const { orderDetailID, ...orderDetailDto } = {
        ...detail,
        orderID: createOrder[0].orderID
      };
      if (!orderDetailID) {
        detailsPromise.push(this.orderDetailService.create(orderDetailDto));
        continue;
      }
      detailsPromise.push(this.orderDetailService.update(orderDetailID, orderDetailDto));
    }
    await Promise.all(detailsPromise);
    return createOrder;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, size, columnFilters, filter } = paginationDto;
    const offset = page * size;
    const [items, totalCount] = await generatePaginatedFilteredData({
      qb: this.txHost.tx,
      columns: {
        orderID: order.orderID,
        orderDate: order.orderDate,
        deliveryDate: order.deliveryDate,
        deliveryAddress: order.deliveryAddress,
        total: order.total,
        includeDelivery: sql`CASE WHEN ${order.includeDelivery} THEN 'SI' ELSE 'NO' END`.as(
          "includeDelivery"
        ),
        completed: sql`CASE WHEN ${order.completed} THEN 'COMPLETADA' ELSE 'PENDIENTE' END`.as("completed"),
        status: sql`CASE WHEN ${order.status} THEN 'ACTIVO' ELSE 'INACTIVO' END`.as("status"),
        person: {
          personID: person.personID,
          fullName: sql`${person.name} || ' ' || ${person.surname}`.as("fullName"),
          name: person.name,
          surname: person.surname,
          phone: person.phone,
          address: person.address,
          identification: person.identification
        },
        orderDetails: jsonAgg({
          orderDetailID: orderDetail.orderDetailID,
          contentTypeID: orderDetail.contentTypeID,
          contentTypeName: contentType.contentTypeName,
          orderDetailCode: orderDetail.orderDetailCode,
          description: orderDetail.description,
          urlContent: orderDetail.urlContent,
          qrJson: orderDetail.qrJson,
          quantity: orderDetail.quantity,
          price: orderDetail.price
        }).as("orderDetails")
      },
      fromTable: order,
      aggregateFunction: (qb) =>
        qb
          .innerJoin(person, eq(person.personID, order.personID))
          .innerJoin(orderDetail, eq(order.orderID, orderDetail.orderID))
          .innerJoin(contentType, eq(orderDetail.contentTypeID, contentType.contentTypeID))
          .groupBy(order.orderID, person.personID),
      filter,
      columnFilters,
      limit: size,
      offset
    });

    return {
      items,
      totalCount: totalCount[0]?.count ?? 0,
      currentPage: page,
      totalPages: Math.ceil(totalCount[0]?.count ?? 0 / size)
    };
  }

  async findOne(orderID: number) {
    const foundOrder = await this.txHost.tx.query.order.findFirst({
      with: {
        person: true,
        orderDetail: true
      },
      where: eq(order.orderID, orderID)
    });
    if (!foundOrder) {
      throw new HttpException("Orden no encontrada", HttpStatus.NOT_FOUND);
    }
    return foundOrder;
  }

  async update(orderID: number, updateOrderDto: UpdateOrderDto) {
    await this.findOne(orderID);
    return this.txHost.tx.update(order).set(updateOrderDto).where(eq(order.orderID, orderID)).returning();
  }

  async toggleStatus(orderID: number) {
    const foundOrder = await this.findOne(orderID);
    return this.update(orderID, { status: !foundOrder.status });
  }
}
