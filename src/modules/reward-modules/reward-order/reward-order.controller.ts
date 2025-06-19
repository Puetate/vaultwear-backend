import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RewardOrderService } from './reward-order.service';
import { CreateRewardOrderDto } from './dto/create-reward-order.dto';
import { UpdateRewardOrderDto } from './dto/update-reward-order.dto';

@Controller('reward-order')
export class RewardOrderController {
  constructor(private readonly rewardOrderService: RewardOrderService) {}

  @Post()
  create(@Body() createRewardOrderDto: CreateRewardOrderDto) {
    return this.rewardOrderService.create(createRewardOrderDto);
  }

  @Get()
  findAll() {
    return this.rewardOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rewardOrderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRewardOrderDto: UpdateRewardOrderDto) {
    return this.rewardOrderService.update(+id, updateRewardOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rewardOrderService.remove(+id);
  }
}
