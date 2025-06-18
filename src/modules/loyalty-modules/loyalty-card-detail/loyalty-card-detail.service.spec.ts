import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyCardDetailService } from './loyalty-card-detail.service';

describe('LoyaltyCardDetailService', () => {
  let service: LoyaltyCardDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoyaltyCardDetailService],
    }).compile();

    service = module.get<LoyaltyCardDetailService>(LoyaltyCardDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
