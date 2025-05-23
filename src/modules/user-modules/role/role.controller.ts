import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RoleService } from "./role.service";

@ApiTags("Role")
@ApiBearerAuth()
@Controller("role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(":roleID")
  findOne(@Param("roleID") roleID: string) {
    return this.roleService.findOne(+roleID);
  }

  @Patch(":roleID")
  update(@Param("roleID") roleID: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+roleID, updateRoleDto);
  }

  @Patch("toggle-status/:roleID")
  toggleStatus(@Param("roleID") roleID: string) {
    return this.roleService.toggleStatus(+roleID);
  }
}
