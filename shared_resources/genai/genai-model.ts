import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModelV1 } from "@ai-sdk/provider";
import { generateObject } from "ai";
import { SupportedModelEnum } from "shared_resources/enums";
import { IModelParams, IModelResponse, IModelTemplate } from "shared_resources/interfaces";
import { z } from "zod";

export class GenAIModel implements IModelTemplate {
  private llm: LanguageModelV1;

  constructor(provider: SupportedModelEnum, params: IModelParams) {
    const createModel = {
      [SupportedModelEnum.GOOGLE_GENERATIVE_AI]: createGoogleGenerativeAI,
      [SupportedModelEnum.OPEN_AI]: createOpenAI,
    }[provider];

    if (!createModel) {
      throw new Error("Model not supported");
    }

    this.llm = createModel({ apiKey: params.apiKey }).languageModel(params.model);
  }

  getSystemInstructions(): string {
    return `
      SYSTEM INSTRUCTIONS:
      You are an AI assistant designed to help users optimize their schedules.
      Your primary role is to provide constructive feedback and actionable suggestions tailored to the user's input. The user will provide you with their schedule, which may range from completely empty to extremely overwhelmed.
      Your task is to:
        1. Analyze the provided schedule (even if it is empty or overly packed).
        2. Offer clear and practical feedback to enhance productivity, balance, and focus.
        3. Suggest realistic adjustments to improve time management without imposing unnecessary changes.
      Always ensure your responses are user-centric, empathetic, and focused on aligning with their goals.
    `;
  }

  getResponseSchema(): any {
    return z.object({
      warnings: z.string().describe("Warnings about tight schedules"),
      recommendations: z.string().describe("Recommendations for balance and focus"),
    });
  }

  getPromptTemplate(request: string): string {
    return ` \
      ${this.getSystemInstructions()}
      Input: ${request}
    `;
  }

  async generateContent(request: string): Promise<IModelResponse> {
    const { object } = await generateObject({
      model: this.llm,
      schema: this.getResponseSchema(),
      prompt: this.getPromptTemplate(request),
    });

    return object as IModelResponse;
  }
}
