import { Test, TestingModule } from '@nestjs/testing';
import { RewardOrderController } from './reward-order.controller';
import { RewardOrderService } from './reward-order.service';

describe('RewardOrderController', () => {
  let controller: RewardOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardOrderController],
      providers: [RewardOrderService],
    }).compile();

    controller = module.get<RewardOrderController>(RewardOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
