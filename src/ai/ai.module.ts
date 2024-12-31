import { AIController } from "./ai.controller";
import { AIService } from "./ai.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  controllers: [AIController],
  imports: [ConfigModule],
  providers: [AIService],
})
export class AIModule {}
