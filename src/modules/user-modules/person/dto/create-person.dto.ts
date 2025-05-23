import { UppercaseTransform } from "@commons/decorators";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class CreatePersonDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @UppercaseTransform()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @UppercaseTransform()
  surname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  identification: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @UppercaseTransform()
  address: string;

  @ApiProperty()
  @IsPhoneNumber("EC")
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
