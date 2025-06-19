import { Module } from '@nestjs/common';
import { RewardQrService } from './reward-qr.service';
import { RewardQrController } from './reward-qr.controller';

@Module({
  controllers: [RewardQrController],
  providers: [RewardQrService],
})
export class RewardQrModule {}
