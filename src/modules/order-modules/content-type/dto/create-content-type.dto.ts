import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateContentTypeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contentTypeName: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
