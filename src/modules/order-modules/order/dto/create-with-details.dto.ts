import { CreateOrderDetailDto } from "@modules/order-modules/order-detail/dto/create-order-detail.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, ValidateNested } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";

class OrderDetailDto extends CreateOrderDetailDto {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  declare orderID: number;
}

export class CreateOrderWithDetailsDto {
  @ApiProperty({ type: CreateOrderDto })
  @ValidateNested()
  @Type(() => CreateOrderDto)
  order: CreateOrderDto;

  @ApiProperty({ type: OrderDetailDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  details: OrderDetailDto[];
}
