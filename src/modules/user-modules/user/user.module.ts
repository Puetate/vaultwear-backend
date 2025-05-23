import { Module } from "@nestjs/common";
import { PersonModule } from "../person/person.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [PersonModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
