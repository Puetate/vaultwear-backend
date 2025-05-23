import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  password: string;

  @ApiProperty()
  @IsPositive()
  personID: number;

  @ApiProperty()
  @IsPositive()
  roleID: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  refreshToken?: string | null;
}
