import { GenerativeModel } from "@google/generative-ai";
import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ICurrentUser } from "shared_resources/interfaces";

@Injectable()
export class AIService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(@Inject("GENAI_MODEL_CONST") private readonly model: GenerativeModel) {}

  async getFeedback(user: ICurrentUser) {
    try {
      // temp
      console.log("user", user);
      const result = await this.model.generateContent("");
      return JSON.parse(result.response.text());
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
