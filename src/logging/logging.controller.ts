import { LoggingService } from "./logging.service";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "shared_resources/decorators";
import { FirebaseJwtAuthGuard } from "shared_resources/guards";
import { ICurrentUser } from "shared_resources/interfaces";

@Controller("logging")
@UseGuards(FirebaseJwtAuthGuard)
export class LoggingController {
  constructor(private readonly loggingSerice: LoggingService) {}

  @Get()
  async getLogs(@CurrentUser() user: ICurrentUser) {
    return this.loggingSerice.getLogs(user);
  }
}
