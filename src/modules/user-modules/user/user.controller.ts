import { PaginationDto } from "@commons/dto";
import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateUserWithPersonDto } from "./dto/create-with-person.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@ApiTags("User")
@ApiBearerAuth()
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("with-person")
  createWitPerson(@Body() createUserWithPersonDto: CreateUserWithPersonDto) {
    return this.userService.createWitPerson(createUserWithPersonDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Get(":userID")
  findOne(@Param("userID") userID: string) {
    return this.userService.findOne(+userID);
  }

  @Patch(":userID")
  update(@Param("userID") userID: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+userID, updateUserDto);
  }

  @Patch("toggle-status/:userID")
  toggleStatus(@Param("userID") userID: string) {
    return this.userService.toggleStatus(+userID);
  }
}
