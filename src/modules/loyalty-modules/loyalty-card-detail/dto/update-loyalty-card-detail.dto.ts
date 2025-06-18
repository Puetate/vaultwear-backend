import { PartialType } from '@nestjs/swagger';
import { CreateLoyaltyCardDetailDto } from './create-loyalty-card-detail.dto';

export class UpdateLoyaltyCardDetailDto extends PartialType(CreateLoyaltyCardDetailDto) {}
