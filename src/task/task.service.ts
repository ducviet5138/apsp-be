import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateTaskDto, UpdateTaskDto } from "shared_resources/dtos";
import { Task } from "shared_resources/entities";
import { ICurrentUser } from "shared_resources/interfaces";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(this.constructor.name);

  async createTask(user: ICurrentUser, dto: CreateTaskDto) {
    try {
      return Task.save({
        ...dto,
        userId: user.id,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateTask(id: string, user: ICurrentUser, dto: UpdateTaskDto) {
    try {
      const existedTask = await Task.findOne({ where: { id, userId: user.id } });
      if (!existedTask) {
        throw new Error("Task not found");
      }

      return Task.save({
        ...existedTask,
        ...dto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteTask(id: string, user: ICurrentUser) {
    try {
      return Task.delete({ id, userId: user.id });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
