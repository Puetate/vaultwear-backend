import { CreatePersonDto } from "@modules/user-modules/person/dto/create-person.dto";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class CreateUserWithPersonDto {
  @ApiProperty({ type: OmitType(CreateUserDto, ["personID"]) })
  @Type(() => OmitType(CreateUserDto, ["personID"]))
  @ValidateNested()
  user: Omit<CreateUserDto, "personID">;

  @ApiProperty({ type: CreatePersonDto })
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person: CreatePersonDto;
}
