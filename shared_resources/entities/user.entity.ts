import { Bucket } from "./bucket.entity";
import { Logging } from "./logging.entity";
import { Task } from "./task.entity";
import { IBucket, ILogging, ITask, IUser } from "shared_resources/interfaces";
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "uid", type: "text", nullable: false })
  uid: string;

  @Column({ name: "name", type: "text", nullable: false })
  name: string;

  @Column({ name: "email", type: "text", nullable: false })
  email: string;

  @Column({ name: "avatar", type: "uuid", nullable: true })
  avatar: string;

  // Relations
  @OneToOne(() => Bucket)
  @JoinColumn({ name: "avatar", referencedColumnName: "id" })
  readonly bucket: IBucket;

  @OneToMany(() => Task, (task) => task.user)
  readonly tasks: ITask[];

  @OneToMany(() => Logging, (logging) => logging.user)
  readonly loggings: ILogging[];
}
