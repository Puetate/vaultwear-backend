import { Test, TestingModule } from '@nestjs/testing';
import { GiftBoxService } from './gift-box.service';

describe('GiftBoxService', () => {
  let service: GiftBoxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GiftBoxService],
    }).compile();

    service = module.get<GiftBoxService>(GiftBoxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
