import { ITask } from "./task.interface";

export interface IFocusDuration {
  id: string;
  start: Date;
  duration: number;
  taskId: string;

  // Relations
  readonly task: ITask;
}
