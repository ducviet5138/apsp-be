import { User } from "./user.entity";
import { ILogging, IUser } from "shared_resources/interfaces";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "loggings" })
export class Logging extends BaseEntity implements ILogging {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "action", type: "text", nullable: false, default: "" })
  action: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp", nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.loggings)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: IUser;
}
