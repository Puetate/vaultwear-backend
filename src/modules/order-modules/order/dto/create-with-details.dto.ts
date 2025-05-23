import { CreateOrderDetailDto } from "@modules/order-modules/order-detail/dto/create-order-detail.dto";
import { CreatePersonDto } from "@modules/user-modules/person/dto/create-person.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, ValidateNested } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";

class OrderDto extends CreateOrderDto {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  declare personID: number;
}

class OrderPersonDto extends CreatePersonDto {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  personID?: number;
}

class OrderDetailDto extends CreateOrderDetailDto {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  declare orderID: number;
}

export class CreateOrderWithDetailsDto {
  @ApiProperty({ type: OrderDto })
  @ValidateNested()
  @Type(() => OrderDto)
  order: OrderDto;

  @ApiProperty({ type: OrderDetailDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  details: OrderDetailDto[];

  @ApiProperty({ type: OrderPersonDto })
  @ValidateNested()
  @Type(() => OrderPersonDto)
  person: OrderPersonDto;
}
