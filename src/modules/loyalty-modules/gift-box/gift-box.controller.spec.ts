import { Test, TestingModule } from '@nestjs/testing';
import { GiftBoxController } from './gift-box.controller';
import { GiftBoxService } from './gift-box.service';

describe('GiftBoxController', () => {
  let controller: GiftBoxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftBoxController],
      providers: [GiftBoxService],
    }).compile();

    controller = module.get<GiftBoxController>(GiftBoxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
