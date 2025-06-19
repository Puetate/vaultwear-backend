import { PartialType } from '@nestjs/swagger';
import { CreateRewardOrderDto } from './create-reward-order.dto';

export class UpdateRewardOrderDto extends PartialType(CreateRewardOrderDto) {}
