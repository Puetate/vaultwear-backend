import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateOrderDetailDto } from "./dto/create-order-detail.dto";
import { UpdateOrderDetailDto } from "./dto/update-order-detail.dto";
import { OrderDetailService } from "./order-detail.service";

@ApiTags("Order Detail")
@ApiBearerAuth()
@Controller("order-detail")
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Post()
  create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
    return this.orderDetailService.create(createOrderDetailDto);
  }

  @Get(":orderDetailID")
  findOne(@Param("orderDetailID") orderDetailID: string) {
    return this.orderDetailService.findOne(+orderDetailID);
  }

  @Get("historic/:orderDetailID")
  findHistoricByOrder(@Param("orderDetailID") orderDetailID: string) {
    return this.orderDetailService.findHistoricByOrderDetail(+orderDetailID);
  }

  @Get("code/:orderDetailCode")
  findByCode(@Param("orderDetailCode") orderDetailCode: string) {
    return this.orderDetailService.findByCode(orderDetailCode);
  }

  @Get("order/:orderID")
  findByOrder(@Param("orderID") orderID: string) {
    return this.orderDetailService.findByOrder(+orderID);
  }

  @Patch(":orderDetailID")
  update(@Param("orderDetailID") orderDetailID: string, @Body() updateOrderDetailDto: UpdateOrderDetailDto) {
    return this.orderDetailService.update(+orderDetailID, updateOrderDetailDto);
  }

  @Patch("toggle-status/:orderDetailID")
  toggleStatus(@Param("orderDetailID") orderDetailID: string) {
    return this.orderDetailService.toggleStatus(+orderDetailID);
  }
}
