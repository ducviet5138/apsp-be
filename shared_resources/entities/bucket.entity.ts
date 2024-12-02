import { IBucket } from "../interfaces";
import { UploadStatusEnum } from "shared_resources/enums";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "buckets" })
export class Bucket extends BaseEntity implements IBucket {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", type: "text", nullable: false })
  name: string;

  @Column({
    name: "upload_status",
    type: "enum",
    enum: UploadStatusEnum,
    nullable: false,
    default: UploadStatusEnum.PENDING,
  })
  uploadStatus: UploadStatusEnum;

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
}
