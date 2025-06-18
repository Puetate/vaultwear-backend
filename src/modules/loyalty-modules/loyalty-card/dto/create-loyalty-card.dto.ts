import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsOptional, IsPositive } from "class-validator";

export class CreateLoyaltyCardDto {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  quantity?: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  quantityClaimed?: number;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsPositive()
  userID: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
