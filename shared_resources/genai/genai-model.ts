import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModelV1 } from "@ai-sdk/provider";
import { SupportedModelEnum } from "shared_resources/enums";
import { IModelParams, IModelTemplate } from "shared_resources/interfaces";

export abstract class GenAIModel implements IModelTemplate {
  protected llm: LanguageModelV1;

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

  abstract getSystemInstructions(): string;
  abstract getResponseSchema(): any;
  abstract getPromptTemplate(request: string): string;
  abstract generateContent(request: string): Promise<any>;
}
