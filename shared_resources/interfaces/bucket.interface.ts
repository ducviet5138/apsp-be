import { UploadStatusEnum } from "shared_resources/enums";

export interface IBucket {
  id: string;
  name: string;
  uploadStatus: UploadStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}
