import { PaginationDto } from "@commons/dto";
import { generatePaginatedFilteredData } from "@commons/utils";
import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { person, role, user } from "@modules/drizzle/schema";
import { Transactional, TransactionHost } from "@nestjs-cls/transactional";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { hash } from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { PersonService } from "../person/person.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateUserWithPersonDto } from "./dto/create-with-person.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly txHost: TransactionHost<DrizzleAdapter>,
    private readonly personService: PersonService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const foundUser = await this.findByEmail(email);
    if (foundUser) {
      throw new HttpException("El email del usuario ya se encuentra en uso", HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await hash(createUserDto.password, 10);
    const createdUser = await this.txHost.tx
      .insert(user)
      .values({ ...createUserDto, password: hashedPassword })
      .returning();
    if (createdUser.length === 0) {
      throw new HttpException("Error al crear el usuario", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return createdUser[0];
  }

  @Transactional()
  async createWitPerson(createUserWithPersonDto: CreateUserWithPersonDto) {
    const { person, role, ...userDto } = createUserWithPersonDto;
    let personID: number;
    if (person.personID) {
      personID = person.personID;
    } else {
      const createdPerson = await this.personService.create(createUserWithPersonDto.person);
      personID = createdPerson?.personID;
    }
    const createUserDto: CreateUserDto = {
      ...userDto,
      personID,
      roleID: role.roleID
    };
    return this.create(createUserDto);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, size, columnFilters, filter } = paginationDto;
    const offset = page * size;

    const [items, totalCount] = await generatePaginatedFilteredData({
      qb: this.txHost.tx,
      columns: {
        userID: user.userID,
        fullName: sql`CONCAT(${person.name},' ', ${person.surname})`.as("fullName"),
        role: {
          roleID: role.roleID,
          roleName: role.roleName
        },
        email: user.email,
        status: sql`CASE WHEN ${user.status} THEN 'ACTIVO' ELSE 'INACTIVO' END`.as("status")
      },
      fromTable: user,
      aggregateFunction: (qb) =>
        qb
          .innerJoin(person, eq(person.personID, user.personID))
          .innerJoin(role, eq(role.roleID, user.roleID)),
      filter,
      columnFilters,
      limit: size,
      offset
    });

    return {
      items,
      totalCount: totalCount[0].count,
      currentPage: page,
      totalPages: Math.ceil(totalCount[0].count / size)
    };
  }

  async findOne(userID: number) {
    const foundUser = await this.txHost.tx
      .select({
        userID: user.userID,
        password: user.password,
        email: user.email,
        status: user.status,
        person: {
          personID: person.personID,
          fullName: sql`CONCAT(${person.name},' ', ${person.surname})`.as("fullName"),
          name: person.name,
          surname: person.surname,
          address: person.address,
          phone: person.phone
        },
        role: {
          roleID: role.roleID,
          roleName: role.roleName
        }
      })
      .from(user)
      .innerJoin(person, eq(person.personID, user.personID))
      .innerJoin(role, eq(role.roleID, user.roleID))
      .where(eq(user.userID, userID));
    if (foundUser && foundUser.length > 0) {
      return foundUser[0];
    } else {
      throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);
    }
  }

  async findByEmail(email: string) {
    const foundUser = await this.txHost.tx
      .select({
        userID: user.userID,
        password: user.password,
        email: user.email,
        status: user.status,
        person: {
          personID: person.personID,
          fullName: sql`CONCAT(${person.name},' ', ${person.surname})`.as("fullName"),
          address: person.address,
          phone: person.phone
        },
        role: {
          roleID: role.roleID,
          roleName: role.roleName
        }
      })
      .from(user)
      .innerJoin(person, eq(person.personID, user.personID))
      .innerJoin(role, eq(role.roleID, user.roleID))
      .where(eq(user.email, email));
    if (foundUser && foundUser.length > 0) {
      return foundUser[0];
    }
    return null;
  }

  async update(userID: number, updateUserDto: UpdateUserDto) {
    await this.findOne(userID);
    if (updateUserDto.email) {
      const foundUser = await this.findByEmail(updateUserDto.email);
      if (foundUser) {
        throw new HttpException("El email del usuario ya se encuentra en uso", HttpStatus.BAD_REQUEST);
      }
    }
    return this.txHost.tx.update(user).set(updateUserDto).where(eq(user.userID, userID)).returning();
  }

  async toggleStatus(userID: number) {
    const foundUser = await this.findOne(userID);
    return this.update(userID, { status: !foundUser.status });
  }
}
