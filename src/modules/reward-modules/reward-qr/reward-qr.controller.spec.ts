import { Test, TestingModule } from '@nestjs/testing';
import { RewardQrController } from './reward-qr.controller';
import { RewardQrService } from './reward-qr.service';

describe('RewardQrController', () => {
  let controller: RewardQrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardQrController],
      providers: [RewardQrService],
    }).compile();

    controller = module.get<RewardQrController>(RewardQrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
