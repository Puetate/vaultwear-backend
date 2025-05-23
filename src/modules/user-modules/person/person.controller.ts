import { PaginationDto } from "@commons/dto";
import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";
import { PersonService } from "./person.service";

@ApiTags("Person")
@ApiBearerAuth()
@Controller("person")
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.personService.findAll(paginationDto);
  }

  @Get(":personID")
  findOne(@Param("personID") personID: string) {
    return this.personService.findOne(+personID);
  }

  @Get("search-identification")
  searchByIdentification(@Query("identification") identification: string) {
    return this.personService.searchByIdentificationOrName(identification);
  }

  @Patch(":personID")
  update(@Param("personID") personID: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+personID, updatePersonDto);
  }

  @Patch("toggle-status/:personID")
  remove(@Param("personID") personID: string) {
    return this.personService.toggleStatus(+personID);
  }
}
