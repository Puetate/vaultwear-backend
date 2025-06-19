import { Injectable } from '@nestjs/common';
import { CreateRewardQrDto } from './dto/create-reward-qr.dto';
import { UpdateRewardQrDto } from './dto/update-reward-qr.dto';

@Injectable()
export class RewardQrService {
  create(createRewardQrDto: CreateRewardQrDto) {
    return 'This action adds a new rewardQr';
  }

  findAll() {
    return `This action returns all rewardQr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rewardQr`;
  }

  update(id: number, updateRewardQrDto: UpdateRewardQrDto) {
    return `This action updates a #${id} rewardQr`;
  }

  remove(id: number) {
    return `This action removes a #${id} rewardQr`;
  }
}
