import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyCardService } from './loyalty-card.service';

describe('LoyaltyCardService', () => {
  let service: LoyaltyCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoyaltyCardService],
    }).compile();

    service = module.get<LoyaltyCardService>(LoyaltyCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
