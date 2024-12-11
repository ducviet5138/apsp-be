import { ITask } from "./task.interface";

export interface IFocusDuration {
  id: string;
  start: Date;
  duration: number;

  // Relations
  readonly task: ITask;
}
