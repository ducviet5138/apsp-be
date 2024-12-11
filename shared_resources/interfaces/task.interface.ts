import { IFocusDuration } from "./focus-duration.interface";
import { PriorityLevelEnum, TaskStatusEnum } from "shared_resources/enums";

export interface ITask {
  id: string;
  name: string;
  description: string;
  priorityLevel: PriorityLevelEnum;
  startTime: Date;
  estimatedTime: number;
  status: TaskStatusEnum;

  // Relations
  readonly focusDurations: IFocusDuration[];
}
