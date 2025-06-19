import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { reward } from "@modules/drizzle/schema";
import { TransactionHost } from "@nestjs-cls/transactional";
import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { CreateRewardDto } from "./dto/create-reward.dto";
import { UpdateRewardDto } from "./dto/update-reward.dto";

@Injectable()
export class RewardService {
  constructor(private readonly txHost: TransactionHost<DrizzleAdapter>) {}

  async create(createRewardDto: CreateRewardDto) {
    await this.checkUnique(createRewardDto.userID);
    return "This action adds a new reward";
  }

  async checkUnique(userID: number) {
    const foundReward = await this.txHost.tx.query.reward.findFirst({
      where: eq(reward.userID, userID)
    });
    if (foundReward) {
      throw new Error("El usuario ya tiene un programa de recompensas asociado");
    }
    return true;
  }

  findAll() {
    return `This action returns all reward`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reward`;
  }

  update(id: number, updateRewardDto: UpdateRewardDto) {
    return `This action updates a #${id} reward`;
  }

  remove(id: number) {
    return `This action removes a #${id} reward`;
  }
}
