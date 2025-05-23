import { CreatePersonDto } from "@modules/user-modules/person/dto/create-person.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested
} from "class-validator";

class UserPersonDto extends CreatePersonDto {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  personID?: number;
}

class UserRoleDto {
  @ApiProperty()
  @IsPositive()
  roleID: number;
}

export class CreateUserWithPersonDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  password: string;

  @ApiProperty({ type: UserPersonDto })
  @ValidateNested()
  @Type(() => UserPersonDto)
  person: UserPersonDto;

  @ApiProperty({ type: UserRoleDto })
  @ValidateNested()
  @Type(() => UserRoleDto)
  role: UserRoleDto;
}
