import { UpdatePersonDto } from "@modules/user-modules/person/dto/update-person.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsPositive, ValidateNested } from "class-validator";
import { UpdateUserDto } from "./update-user.dto";

class UserDto extends UpdateUserDto {
  @ApiProperty()
  @IsPositive()
  userID: number;
}

class PersonDto extends UpdatePersonDto {
  @ApiProperty()
  @IsPositive()
  personID: number;
}

export class UpdateUserWithPersonDto {
  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  @ValidateNested()
  user: UserDto;

  @ApiProperty({ type: PersonDto })
  @ValidateNested()
  @Type(() => PersonDto)
  person: PersonDto;
}
