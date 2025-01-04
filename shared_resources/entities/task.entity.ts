import { FocusDuration } from "./focus-duration.entity";
import { User } from "./user.entity";
import { PriorityLevelEnum, TaskStatusEnum } from "shared_resources/enums";
import { IFocusDuration, ITask, IUser } from "shared_resources/interfaces";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "tasks" })
export class Task extends BaseEntity implements ITask {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", type: "text", nullable: false, default: "" })
  name: string;

  @Column({ name: "description", type: "text", nullable: false, default: "" })
  description: string;

  @Column({ name: "priority_level", type: "enum", enum: PriorityLevelEnum, default: PriorityLevelEnum.LOW })
  priorityLevel: PriorityLevelEnum;

  @Column({ name: "start_time", type: "timestamp", nullable: true })
  startTime: Date;

  @Column({ name: "estimated_time", type: "int", nullable: true })
  estimatedTime: number;

  @Column({ name: "status", type: "enum", enum: TaskStatusEnum, nullable: false, default: TaskStatusEnum.TODO })
  status: TaskStatusEnum;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId: string;

  // Relations
  @OneToMany(() => FocusDuration, (focusDuration) => focusDuration.task, {
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  readonly focusDurations: IFocusDuration[];

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  readonly user: IUser;
}
