import { APP_ROLES } from "@commons/constants/app-roles.constant";
import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { role } from "@modules/drizzle/schema";
import { TransactionHost } from "@nestjs-cls/transactional";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RoleService {
  constructor(private readonly txHost: TransactionHost<DrizzleAdapter>) {}

  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.findByName(createRoleDto.roleName as keyof typeof APP_ROLES);
    if (existingRole) {
      throw new HttpException("Role already exists", HttpStatus.BAD_REQUEST);
    }
    return this.txHost.tx.insert(role).values(createRoleDto).returning();
  }

  findAll() {
    return this.txHost.tx.query.role.findMany();
  }

  async findOne(roleID: number) {
    const foundRole = await this.txHost.tx.query.role.findFirst({
      where: eq(role.roleID, roleID)
    });
    if (!foundRole) {
      throw new HttpException("Role not found", HttpStatus.NOT_FOUND);
    }
    return foundRole;
  }

  findByName(roleName: keyof typeof APP_ROLES) {
    return this.txHost.tx.query.role.findFirst({
      where: eq(role.roleName, roleName)
    });
  }

  async update(roleID: number, updateRoleDto: UpdateRoleDto) {
    await this.findOne(roleID);
    return this.txHost.tx.update(role).set(updateRoleDto).where(eq(role.roleID, roleID)).returning();
  }

  async toggleStatus(roleID: number) {
    const foundRole = await this.findOne(roleID);
    return this.update(roleID, { status: !foundRole.status });
  }
}
