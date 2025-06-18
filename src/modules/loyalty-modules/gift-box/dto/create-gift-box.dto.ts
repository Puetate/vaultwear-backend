import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsOptional, IsPositive } from "class-validator";

export class CreateGiftBoxDto {
  @ApiProperty()
  @IsPositive()
  loyaltyCardID: number;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
