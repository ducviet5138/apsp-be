import * as _ from "lodash";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { Logging } from "shared_resources/entities";
import { LoggingActionEnum } from "shared_resources/enums";
import { ICurrentUser } from "shared_resources/interfaces";

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(this.constructor.name);

  async getLogs(user: ICurrentUser) {
    try {
      // Fetch logs for the user, ordered by createdAt descending
      const logs = await Logging.find({
        where: { userId: user.id },
        order: { createdAt: "DESC" },
      });

      // Group logs by action type
      const groupedLogs = _.groupBy(logs, "action");

      // Format and return the result as grouped data
      return {
        [LoggingActionEnum.CREATE_TASK]: groupedLogs[LoggingActionEnum.CREATE_TASK] || [],
        [LoggingActionEnum.UPDATE_TASK]: groupedLogs[LoggingActionEnum.UPDATE_TASK] || [],
        [LoggingActionEnum.DELETE_TASK]: groupedLogs[LoggingActionEnum.DELETE_TASK] || [],
        [LoggingActionEnum.UPDATE_FOCUS_DURATION]: groupedLogs[LoggingActionEnum.UPDATE_FOCUS_DURATION] || [],
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
