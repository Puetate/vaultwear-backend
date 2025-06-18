import { PartialType } from '@nestjs/swagger';
import { CreateGiftBoxDto } from './create-gift-box.dto';

export class UpdateGiftBoxDto extends PartialType(CreateGiftBoxDto) {}
