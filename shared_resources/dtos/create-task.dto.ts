import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { PriorityLevelEnum, TaskStatusEnum } from "shared_resources/enums";

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(PriorityLevelEnum, { message: `Priority Level must be in ${Object.values(PriorityLevelEnum).join(", ")}` })
  priorityLevel: PriorityLevelEnum;

  @IsDateString()
  startTime: Date;

  @IsNumber()
  estimatedTime: number;

  @IsOptional()
  @IsEnum(TaskStatusEnum, { message: `Task Status must be in ${Object.values(TaskStatusEnum).join(", ")}` })
  status: TaskStatusEnum;
}
