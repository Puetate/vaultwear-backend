import { IsPositiveDecimal } from "@commons/decorators";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDecimal,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested
} from "class-validator";

export class ContentDto {
  @ApiProperty()
  @IsPositive()
  contentTypeID: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contentTypeName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  urlContent: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
}

export class CreateOrderDetailDto {
  @ApiProperty()
  @IsPositive()
  orderID: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsJSON()
  qrJson?: string;

  @ApiProperty({ type: ContentDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => ContentDto)
  contents?: ContentDto[];

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
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
