import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { User } from "shared_resources/entities";
import { ICurrentUser } from "shared_resources/interfaces";

@Injectable()
export class UserService {
  private readonly logger = new Logger(this.constructor.name);

  async getUserProfile(user: ICurrentUser) {
    try {
      return User.find({ where: { id: user.id } });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
