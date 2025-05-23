import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { contentType } from "@modules/drizzle/schema";
import { TransactionHost } from "@nestjs-cls/transactional";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { CreateContentTypeDto } from "./dto/create-content-type.dto";
import { UpdateContentTypeDto } from "./dto/update-content-type.dto";

@Injectable()
export class ContentTypeService {
  constructor(private readonly txHost: TransactionHost<DrizzleAdapter>) {}

  async create(createContentTypeDto: CreateContentTypeDto) {
    const { contentTypeName } = createContentTypeDto;
    const foundContentType = await this.findByName(contentTypeName);
    if (foundContentType) {
      throw new HttpException("El tipo de contenido ya existe", HttpStatus.BAD_REQUEST);
    }
    return this.txHost.tx.insert(contentType).values(createContentTypeDto).returning();
  }

  findAll() {
    return this.txHost.tx.query.contentType.findMany();
  }

  async findOne(contentTypeID: number) {
    const foundContentType = await this.txHost.tx.query.contentType.findFirst({
      where: eq(contentType.contentTypeID, contentTypeID)
    });
    if (!foundContentType) {
      throw new HttpException("Tipo de contenido no encontrado", HttpStatus.NOT_FOUND);
    }
    return foundContentType;
  }

  findByName(contentTypeName: string) {
    return this.txHost.tx.query.contentType.findFirst({
      where: eq(contentType.contentTypeName, contentTypeName)
    });
  }

  async update(contentTypeID: number, updateContentTypeDto: UpdateContentTypeDto) {
    await this.findOne(contentTypeID);
    return this.txHost.tx
      .update(contentType)
      .set(updateContentTypeDto)
      .where(eq(contentType.contentTypeID, contentTypeID))
      .returning();
  }

  async toggleStatus(contentTypeID: number) {
    const foundContentType = await this.findOne(contentTypeID);
    return this.update(contentTypeID, { status: !foundContentType.status });
  }
}
