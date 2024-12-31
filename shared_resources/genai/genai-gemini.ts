import { GenAIModel } from "./genai-model";
import { SupportedModelEnum } from "shared_resources/enums";
import { IModelParams, IModelTemplate } from "shared_resources/interfaces";

export class GenAIGemini extends GenAIModel implements IModelTemplate {
  constructor(params: IModelParams) {
    super(SupportedModelEnum.GOOGLE_GENERATIVE_AI, params);
  }
}
