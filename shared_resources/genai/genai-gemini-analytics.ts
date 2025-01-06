import { GenAIModel } from "./genai-model";
import { generateObject } from "ai";
import { SupportedModelEnum } from "shared_resources/enums";
import { IModelParams, IModelResponseAnalytics, IModelTemplate } from "shared_resources/interfaces";
import { z } from "zod";

export class GenAIGeminiAnalytic extends GenAIModel implements IModelTemplate {
  constructor(params: IModelParams) {
    super(SupportedModelEnum.GOOGLE_GENERATIVE_AI, params);
  }

  getSystemInstructions(): string {
    return `
      SYSTEM INSTRUCTIONS:
      You are an AI assistant designed to summarize and analyze user's analytics.
      Your primary role is to provide constructive feedback and actionable suggestions tailored to the user's input. 
      Your task is to:
        1. Analyze the user most focused tasks and time spent on them.
        2. The tasks that need more attention.
        3. Motivation feedback for the user.
      Always ensure your responses are user-centric, empathetic, and focused on aligning with their goals.
    `;
  }

  getResponseSchema(): any {
    return z.object({
      result: z.string().describe("Result of the analysis"),
    });
  }

  getPromptTemplate(request: string): string {
    return ` \
      ${this.getSystemInstructions()}
      Input: ${request}
    `;
  }

  async generateContent(request: string): Promise<IModelResponseAnalytics> {
    const { object } = await generateObject({
      model: this.llm,
      schema: this.getResponseSchema(),
      prompt: this.getPromptTemplate(request),
    });

    return object as IModelResponseAnalytics;
  }
}
