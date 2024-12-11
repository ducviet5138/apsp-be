import { AIService } from "./ai.service";
import { Controller, Get } from "@nestjs/common";
import { CurrentUser } from "shared_resources/decorators";
import { ICurrentUser } from "shared_resources/interfaces";

@Controller("ai")
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get("feedback")
  async getFeedback(@CurrentUser() user: ICurrentUser) {
    return this.aiService.getFeedback(user);
  }
}
