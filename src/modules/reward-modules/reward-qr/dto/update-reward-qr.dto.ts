import { PartialType } from '@nestjs/swagger';
import { CreateRewardQrDto } from './create-reward-qr.dto';

export class UpdateRewardQrDto extends PartialType(CreateRewardQrDto) {}
