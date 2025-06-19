import { Injectable } from '@nestjs/common';
import { CreateRewardOrderDto } from './dto/create-reward-order.dto';
import { UpdateRewardOrderDto } from './dto/update-reward-order.dto';

@Injectable()
export class RewardOrderService {
  create(createRewardOrderDto: CreateRewardOrderDto) {
    return 'This action adds a new rewardOrder';
  }

  findAll() {
    return `This action returns all rewardOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rewardOrder`;
  }

  update(id: number, updateRewardOrderDto: UpdateRewardOrderDto) {
    return `This action updates a #${id} rewardOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} rewardOrder`;
  }
}
