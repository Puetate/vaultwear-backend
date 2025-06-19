import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RewardQrService } from './reward-qr.service';
import { CreateRewardQrDto } from './dto/create-reward-qr.dto';
import { UpdateRewardQrDto } from './dto/update-reward-qr.dto';

@Controller('reward-qr')
export class RewardQrController {
  constructor(private readonly rewardQrService: RewardQrService) {}

  @Post()
  create(@Body() createRewardQrDto: CreateRewardQrDto) {
    return this.rewardQrService.create(createRewardQrDto);
  }

  @Get()
  findAll() {
    return this.rewardQrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rewardQrService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRewardQrDto: UpdateRewardQrDto) {
    return this.rewardQrService.update(+id, updateRewardQrDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rewardQrService.remove(+id);
  }
}
