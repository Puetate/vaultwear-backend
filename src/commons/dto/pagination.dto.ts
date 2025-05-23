import { IsPositiveOrZero, ParseBooleanTransform, ParseIntTransform } from "@commons/decorators";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class PaginationDto {
  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @IsPositiveOrZero()
  @ParseIntTransform()
  page: number = 0;

  @ApiProperty({ default: 5, required: false })
  @IsOptional()
  @IsPositiveOrZero()
  @ParseIntTransform()
  size: number = 5;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @ParseBooleanTransform()
  status?: boolean;

  @ApiProperty({ default: "", required: false })
  @IsOptional()
  @IsString()
  filter?: string;

  @ApiProperty({ default: "[]", required: false })
  @IsOptional()
  @IsString()
  columnFilters?: string;
}
