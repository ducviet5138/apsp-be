import { IModelResponse } from "./model-response.interface";

export interface IModelTemplate {
  getSystemInstructions(): string;
  getResponseSchema(): any;
  getPromptTemplate(request: string): string;
  generateContent(request: string): Promise<IModelResponse>;
}
