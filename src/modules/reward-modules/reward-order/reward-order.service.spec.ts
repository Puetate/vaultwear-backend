import { Test, TestingModule } from '@nestjs/testing';
import { RewardOrderService } from './reward-order.service';

describe('RewardOrderService', () => {
  let service: RewardOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RewardOrderService],
    }).compile();

    service = module.get<RewardOrderService>(RewardOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
