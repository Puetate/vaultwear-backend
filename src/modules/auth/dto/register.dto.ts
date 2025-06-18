import { CreatePersonDto } from "@modules/user-modules/person/dto/create-person.dto";
import { CreateUserDto } from "@modules/user-modules/user/dto/create-user.dto";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class RegisterDto {
  @ApiProperty({ type: OmitType(CreateUserDto, ["roleID", "personID"]) })
  @Type(() => OmitType(CreateUserDto, ["roleID", "personID"]))
  @ValidateNested()
  user: Omit<CreateUserDto, "roleID" | "personID">;

  @ApiProperty()
  @Type(() => CreatePersonDto)
  @ValidateNested()
  person: CreatePersonDto;
}
