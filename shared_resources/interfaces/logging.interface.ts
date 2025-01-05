import { IUser } from "./user.interface";

export interface ILogging {
  id: string;
  action: string;
  userId: string;
  updatedAt: Date;
  createdAt: Date;

  // Relations
  user: IUser;
}
