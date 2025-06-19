import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsOptional, IsPositive } from "class-validator";

export class CreateRewardDto {
  @ApiProperty()
  @IsPositive()
  userID: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  maxDiscount?: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  discount?: number;

  @ApiProperty()
  @IsOptional()
  @IsJSON()
  jsonReward?: string;
}
