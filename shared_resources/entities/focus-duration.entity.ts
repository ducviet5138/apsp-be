import { Task } from "./task.entity";
import { IFocusDuration } from "shared_resources/interfaces/focus-duration.interface";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "focus_durations" })
export class FocusDuration extends BaseEntity implements IFocusDuration {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "start", type: "timestamp", nullable: false })
  start: Date;

  @Column({ name: "duration", type: "int", nullable: false })
  duration: number;

  @Column({ name: "task_id", type: "uuid", nullable: false })
  taskId: string;

  // Relations
  @ManyToOne(() => Task, (task) => task.focusDurations)
  @JoinColumn({ name: "task_id", referencedColumnName: "id" })
  task: Task;
}
