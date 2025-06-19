import { PaginationDto } from "@commons/dto";
import { generatePaginatedFilteredData } from "@commons/utils";
import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { person, role, user } from "@modules/drizzle/schema";
import { Transactional, TransactionHost } from "@nestjs-cls/transactional";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { hash } from "bcrypt";
import { and, eq, ilike, like, or, sql } from "drizzle-orm";
import { PersonService } from "../person/person.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateUserWithPersonDto } from "./dto/create-with-person.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserWithPersonDto } from "./dto/update-with-person.dto";

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
  async createWithPerson(createUserWithPersonDto: CreateUserWithPersonDto) {
    const { person, user } = createUserWithPersonDto;
    const createdPerson = await this.personService.create(person);
    const createUserDto: CreateUserDto = {
      ...user,
      personID: createdPerson.personID
    };
    return this.create(createUserDto);
  }

  @Transactional()
  async updateWithPerson(updateUserWithPersonDto: UpdateUserWithPersonDto) {
    const { person, user } = updateUserWithPersonDto;
    const { personID, ...personDto } = person;
    const { userID, ...userDto } = user;
    await this.personService.update(personID, personDto);
    return this.update(userID, userDto);
  }

  searchByIdentificationOrName(search: string) {
    return this.txHost.tx
      .select({
        userID: user.userID,
        email: user.email,
        fullName: sql`CONCAT(${person.name},' ', ${person.surname})`.as("fullName"),
        person: {
          personID: person.personID,
          identification: person.identification,
          name: person.name,
          surname: person.surname,
          address: person.address,
          phone: person.phone
        }
      })
      .from(user)
      .innerJoin(person, eq(person.personID, user.personID))
      .where(
        and(
          or(
            like(person.identification, `%${search}%`),
            ilike(person.name, `%${search}%`),
            ilike(person.surname, `%${search}%`)
          ),
          eq(person.status, true),
          eq(user.status, true)
        )
      );
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
        person: {
          personID: person.personID,
          name: person.name,
          surname: person.surname,
          identification: person.identification,
          address: person.address,
          phone: person.phone
        },
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
    const foundUser = await this.findOne(userID);
    if (updateUserDto.email && foundUser.email !== updateUserDto.email) {
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
