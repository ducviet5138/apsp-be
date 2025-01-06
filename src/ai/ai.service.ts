import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Task } from "shared_resources/entities";
import { GenAIGeminiAnalytic, GenAIGeminiFeedback } from "shared_resources/genai";
import { ICurrentUser, IFocusDuration, IModelTemplate, ITask } from "shared_resources/interfaces";

@Injectable()
export class AIService {
  private readonly logger = new Logger(this.constructor.name);
  private feedbackModel: IModelTemplate;
  private analyticModel: IModelTemplate;

  constructor(private readonly configService: ConfigService) {
    this.feedbackModel = new GenAIGeminiFeedback({
      model: "learnlm-1.5-pro-experimental",
      apiKey: this.configService.get<string>("GEMINI_API_KEY"),
    });

    this.analyticModel = new GenAIGeminiAnalytic({
      model: "learnlm-1.5-pro-experimental",
      apiKey: this.configService.get<string>("GEMINI_API_KEY"),
    });
  }

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

      const result = await this.feedbackModel.generateContent(data);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getAnalytics(user: ICurrentUser) {
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

      const result = await this.analyticModel.generateContent(data);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
