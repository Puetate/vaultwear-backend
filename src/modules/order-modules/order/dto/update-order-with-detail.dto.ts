import { CreateOrderDetailDto } from "@modules/order-modules/order-detail/dto/create-order-detail.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, ValidateNested } from "class-validator";
import { UpdateOrderDto } from "./update-order.dto";

class OrderDto extends UpdateOrderDto {
  @ApiProperty()
  @IsPositive()
  orderID: number;
}

class OrderDetailDto extends CreateOrderDetailDto {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  orderDetailID: number;
}

export class UpdateOrderWithDetailsDto {
  @ApiProperty({ type: OrderDto })
  @ValidateNested()
  @Type(() => OrderDto)
  order: OrderDto;

  @ApiProperty({ type: OrderDetailDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  details: OrderDetailDto[];
}
