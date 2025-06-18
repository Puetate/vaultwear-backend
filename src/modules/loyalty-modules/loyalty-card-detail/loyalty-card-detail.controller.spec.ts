import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyCardDetailController } from './loyalty-card-detail.controller';
import { LoyaltyCardDetailService } from './loyalty-card-detail.service';

describe('LoyaltyCardDetailController', () => {
  let controller: LoyaltyCardDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyCardDetailController],
      providers: [LoyaltyCardDetailService],
    }).compile();

    controller = module.get<LoyaltyCardDetailController>(LoyaltyCardDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
