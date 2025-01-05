import { LoggingController } from "./logging.controller";
import { LoggingService } from "./logging.service";
import { Module } from "@nestjs/common";

@Module({
  controllers: [LoggingController],
  providers: [LoggingService],
})
export class LoggingModule {}
