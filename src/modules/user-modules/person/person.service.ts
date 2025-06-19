import { PaginationDto } from "@commons/dto";
import { generatePaginatedFilteredData } from "@commons/utils";
import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { person } from "@modules/drizzle/schema";
import { TransactionHost } from "@nestjs-cls/transactional";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { and, eq, ilike, like, or, sql } from "drizzle-orm";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";

@Injectable()
export class PersonService {
  constructor(private readonly txHost: TransactionHost<DrizzleAdapter>) {}

  async create(createPersonDto: CreatePersonDto) {
    await this.checkUnique(createPersonDto.identification, createPersonDto.phone);
    const query = await this.txHost.tx.insert(person).values(createPersonDto).returning();
    if (query.length === 0) {
      throw new HttpException("Error al crear la persona", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return query[0];
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, size, columnFilters, filter } = paginationDto;
    const offset = page * size;
    const [items, totalCount] = await generatePaginatedFilteredData({
      qb: this.txHost.tx,
      columns: {
        personID: person.personID,
        name: person.name,
        surname: person.surname,
        identification: person.identification,
        address: person.address,
        phone: person.phone,
        status: sql`CASE WHEN ${person.status} THEN 'ACTIVO' ELSE 'INACTIVO' END`.as("status")
      },
      fromTable: person,
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

  async findOne(personID: number) {
    const foundPerson = await this.txHost.tx.query.person.findFirst({
      where: eq(person.personID, personID)
    });
    if (!foundPerson) {
      throw new HttpException(`No se encontró la persona con el personID ${personID}`, HttpStatus.NOT_FOUND);
    }
    return foundPerson;
  }

  searchByIdentificationOrName(search: string) {
    return this.txHost.tx.query.person.findMany({
      where: and(
        or(
          like(person.identification, `%${search}%`),
          ilike(person.name, `%${search}%`),
          ilike(person.surname, `%${search}%`)
        ),
        eq(person.status, true)
      )
    });
  }

  async checkUnique(identification: string, phone: string) {
    const foundPerson = await this.txHost.tx.query.person.findFirst({
      where: or(eq(person.identification, identification), eq(person.phone, phone))
    });
    if (foundPerson) {
      throw new HttpException(
        `La persona con el número de identificación ${identification} o el teléfono ${phone} ya existe`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async update(personID: number, updatePersonDto: UpdatePersonDto) {
    const foundPerson = await this.findOne(personID);
    if (
      foundPerson.identification !== updatePersonDto.identification ||
      foundPerson.phone !== updatePersonDto.phone
    ) {
      await this.checkUnique(updatePersonDto.identification ?? "", updatePersonDto.phone ?? "");
    }
    return this.txHost.tx
      .update(person)
      .set(updatePersonDto)
      .where(eq(person.personID, personID))
      .returning();
  }

  async toggleStatus(personID: number) {
    const foundPerson = await this.findOne(personID);
    return this.update(personID, { status: !foundPerson.status });
  }
}
