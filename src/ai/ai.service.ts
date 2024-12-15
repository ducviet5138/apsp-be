import { GenerativeModel } from "@google/generative-ai";
import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { Task } from "shared_resources/entities";
import { ICurrentUser } from "shared_resources/interfaces";
import { IFocusDuration } from "shared_resources/interfaces/focus-duration.interface";
import { ITask } from "shared_resources/interfaces/task.interface";

@Injectable()
export class AIService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(@Inject("GENAI_MODEL_CONST") private readonly model: GenerativeModel) {}

  async getFeedback(user: ICurrentUser) {
    try {
      // Get all task
      const tasks = await Task.find({
        where: {
          userId: user.id,
        },
        relations: ["focusDurations"],
      });

      // Clean data
      const data: string = !tasks
        ? ""
        : tasks
            .map((task: ITask) => {
              const cleanedFocusDurations = !task.focusDurations
                ? ""
                : task.focusDurations.map((fd: IFocusDuration) => {
                    return {
                      start: fd.start.toISOString(),
                      end: new Date(fd.start.getTime() + fd.duration * 1000).toISOString,
                    };
                  });
              const endTime = new Date(task.startTime.getTime() + task.estimatedTime * 1000).toISOString;

              const resultJson = {
                ...task,
                estimatedTime: undefined,
                focusDurations: cleanedFocusDurations,
                endTime: endTime,
              };

              return JSON.stringify(resultJson);
            })
            .join("| ");

      const result = await this.model.generateContent(data);
      return JSON.parse(result.response.text());
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
