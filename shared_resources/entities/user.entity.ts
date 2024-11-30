import { Bucket } from "./bucket.entity";
import { IUser } from "shared_resources/interfaces";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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
  readonly bucket: Bucket;
}
