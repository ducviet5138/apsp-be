import { IFocusDuration } from "./focus-duration.interface";
import { IUser } from "./user.interface";
import { PriorityLevelEnum, TaskStatusEnum } from "shared_resources/enums";

export interface ITask {
  id: string;
  name: string;
  description: string;
  priorityLevel: PriorityLevelEnum;
  startTime: Date;
  estimatedTime: number;
  status: TaskStatusEnum;
  userId: string;

  // Relations
  readonly focusDurations: IFocusDuration[];
  readonly user: IUser;
}
