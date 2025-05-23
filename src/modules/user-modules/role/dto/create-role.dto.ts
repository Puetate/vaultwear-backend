import { UppercaseTransform } from "@commons/decorators";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @UppercaseTransform()
  roleName: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
