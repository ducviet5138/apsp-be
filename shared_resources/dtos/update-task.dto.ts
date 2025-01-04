import { CreateTaskDto } from "./create-task.dto";
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { IReducedFocusDuration } from "shared_resources/interfaces";

class ReducedFocusDuration {
  @IsDateString()
  start: Date;

  @IsNumber()
  duration: number;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReducedFocusDuration)
  focusDurations: IReducedFocusDuration[];
}
