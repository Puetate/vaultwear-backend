import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ContentTypeService } from "./content-type.service";
import { CreateContentTypeDto } from "./dto/create-content-type.dto";
import { UpdateContentTypeDto } from "./dto/update-content-type.dto";

@ApiTags("Content Type")
@ApiBearerAuth()
@Controller("content-type")
export class ContentTypeController {
  constructor(private readonly contentTypeService: ContentTypeService) {}

  @Post()
  create(@Body() createContentTypeDto: CreateContentTypeDto) {
    return this.contentTypeService.create(createContentTypeDto);
  }

  @Get()
  findAll() {
    return this.contentTypeService.findAll();
  }

  @Get(":contentTypeID")
  findOne(@Param("contentTypeID") contentTypeID: string) {
    return this.contentTypeService.findOne(+contentTypeID);
  }

  @Patch(":contentTypeID")
  update(@Param("contentTypeID") contentTypeID: string, @Body() updateContentTypeDto: UpdateContentTypeDto) {
    return this.contentTypeService.update(+contentTypeID, updateContentTypeDto);
  }

  @Patch("toggle-status/:contentTypeID")
  toggleStatus(@Param("contentTypeID") contentTypeID: string) {
    return this.contentTypeService.toggleStatus(+contentTypeID);
  }
}
