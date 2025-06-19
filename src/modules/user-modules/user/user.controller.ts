import { PaginationDto } from "@commons/dto";
import { Body, Controller, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateUserWithPersonDto } from "./dto/create-with-person.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserWithPersonDto } from "./dto/update-with-person.dto";
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
    return this.userService.createWithPerson(createUserWithPersonDto);
  }

  @Put("with-person")
  updateWitPerson(@Body() updateUserWithPersonDto: UpdateUserWithPersonDto) {
    return this.userService.updateWithPerson(updateUserWithPersonDto);
  }

  @Get("search-identification")
  searchByIdentification(@Query("search") search: string) {
    return this.userService.searchByIdentificationOrName(search);
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
