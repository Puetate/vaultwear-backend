import { IsPositiveDecimal } from "@commons/decorators";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDecimal,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl
} from "class-validator";

export class CreateOrderDetailDto {
  @ApiProperty()
  @IsPositive()
  orderID: number;

  @ApiProperty()
  @IsPositive()
  contentTypeID: number;

  @ApiProperty()
  @IsOptional()
  @IsJSON()
  qrJson?: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  urlContent?: string;

  @ApiProperty()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsDecimal()
  @IsPositiveDecimal()
  price: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderDetailCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
