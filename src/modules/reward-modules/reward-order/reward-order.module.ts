import { Module } from '@nestjs/common';
import { RewardOrderService } from './reward-order.service';
import { RewardOrderController } from './reward-order.controller';

@Module({
  controllers: [RewardOrderController],
  providers: [RewardOrderService],
})
export class RewardOrderModule {}
