import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsJSON, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateLoyaltyCardDetailDto {
  @ApiProperty()
  @IsPositive()
  orderDetailID: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  loyaltyCardID?: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  claimDate?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  claimCode?: string;

  @ApiProperty()
  @IsOptional()
  @IsJSON()
  qrJson?: string;
}
