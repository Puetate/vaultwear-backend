import { PaginationDto } from "@commons/dto";
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CreateOrderWithDetailsDto } from "./dto/create-with-details.dto";
import { UpdateOrderWithDetailsDto } from "./dto/update-order-with-detail.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderService } from "./order.service";

@ApiTags("Order")
@ApiBearerAuth()
@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Post("with-details")
  createWithDetails(@Body() createOrderWithDetailsDto: CreateOrderWithDetailsDto) {
    return this.orderService.createWithDetails(createOrderWithDetailsDto);
  }

  @Put("with-details")
  updateWithDetails(@Body() updateOrderWithDetailsDto: UpdateOrderWithDetailsDto) {
    return this.orderService.updateWithDetails(updateOrderWithDetailsDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.orderService.findAll(paginationDto);
  }

  @Get(":orderID")
  findOne(@Param("orderID") orderID: string) {
    return this.orderService.findOne(+orderID);
  }

  @Patch(":orderID")
  update(@Param("orderID") orderID: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+orderID, updateOrderDto);
  }

  @Delete(":orderID")
  toggleStatus(@Param("orderID") orderID: string) {
    return this.orderService.toggleStatus(+orderID);
  }
}
