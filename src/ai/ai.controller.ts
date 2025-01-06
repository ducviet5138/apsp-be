import { AIService } from "./ai.service";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "shared_resources/decorators";
import { FirebaseJwtAuthGuard } from "shared_resources/guards";
import { ICurrentUser } from "shared_resources/interfaces";

@Controller("ai")
@UseGuards(FirebaseJwtAuthGuard)
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get("feedback")
  async getFeedback(@CurrentUser() user: ICurrentUser) {
    return this.aiService.getFeedback(user);
  }

  // @Get("analytics")
  // async getAnalytics(@CurrentUser() user: ICurrentUser) {
  //   return this.aiService.getAnalytics(user);
  // }
}
