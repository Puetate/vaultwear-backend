import { Test, TestingModule } from '@nestjs/testing';
import { RewardQrService } from './reward-qr.service';

describe('RewardQrService', () => {
  let service: RewardQrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RewardQrService],
    }).compile();

    service = module.get<RewardQrService>(RewardQrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
