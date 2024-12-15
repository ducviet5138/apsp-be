import { AIController } from "./ai.controller";
import { AIService } from "./ai.service";
import { GoogleGenerativeAI, ResponseSchema, SchemaType } from "@google/generative-ai";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GENAI_MODEL_CONST } from "shared_resources/const";

@Module({
  controllers: [AIController],
  imports: [ConfigModule],
  providers: [
    AIService,
    {
      provide: GENAI_MODEL_CONST,
      useFactory: async (configService: ConfigService) => {
        const schema: ResponseSchema = {
          type: SchemaType.OBJECT,
          properties: {
            warnings: {
              type: SchemaType.STRING,
              description: "Warnings about tight schedules",
              nullable: false,
            },
            recommendations: {
              type: SchemaType.STRING,
              description: "Recommendations for balance and focus",
              nullable: false,
            },
          },
        };

        const genAI = new GoogleGenerativeAI(configService.get("GEMINI_API_KEY"));
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash-001",
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
          },
          systemInstruction:
            " \
            You are an AI assistant designed to help users optimize their schedules. \
            Your primary role is to provide constructive feedback and actionable suggestions tailored to the user's input. The user will provide you with their schedule, which may range from completely empty to extremely overwhelmed. \
            Your task is to: \
              1. Analyze the provided schedule (even if it is empty or overly packed). \
              2. Offer clear and practical feedback to enhance productivity, balance, and focus. \
              3. Suggest realistic adjustments to improve time management without imposing unnecessary changes. \
            Always ensure your responses are user-centric, empathetic, and focused on aligning with their goals. \
            ",
        });

        return model;
      },
      inject: [ConfigService],
    },
  ],
})
export class AIModule {}
