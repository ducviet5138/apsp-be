import { IBucket } from "./bucket.interface";

export interface IUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  avatar: string;

  // Relations
  readonly bucket: IBucket;
}
