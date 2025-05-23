import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength
} from "class-validator";

export class CreateOrderDto {
  @ApiProperty()
  @IsPositive()
  personID: number;

  @ApiProperty()
  @IsDateString()
  orderDate: string;

  @ApiProperty()
  @IsDateString()
  deliveryDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  deliveryAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  includeDelivery?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsDecimal()
  total?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
