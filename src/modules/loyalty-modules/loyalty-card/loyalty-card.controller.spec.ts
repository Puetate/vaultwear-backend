import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyCardController } from './loyalty-card.controller';
import { LoyaltyCardService } from './loyalty-card.service';

describe('LoyaltyCardController', () => {
  let controller: LoyaltyCardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyCardController],
      providers: [LoyaltyCardService],
    }).compile();

    controller = module.get<LoyaltyCardController>(LoyaltyCardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
