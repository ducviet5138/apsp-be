import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { RESPONSE_OK } from "shared_resources/const";
import { CreateTaskDto, UpdateTaskDto } from "shared_resources/dtos";
import { Logging, Task } from "shared_resources/entities";
import { LoggingActionEnum } from "shared_resources/enums";
import { ICurrentUser } from "shared_resources/interfaces";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(this.constructor.name);

  async createTask(user: ICurrentUser, dto: CreateTaskDto) {
    try {
      const task = await Task.save({
        ...dto,
        userId: user.id,
      });

      await Logging.save({
        action: LoggingActionEnum.CREATE_TASK,
        userId: user.id,
      });

      return task;
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

      const updatedTask = await Task.save({
        ...existedTask,
        ...dto,
      });

      if (dto.focusDurations && dto.focusDurations.length > 0) {
        await Logging.save({
          action: LoggingActionEnum.UPDATE_FOCUS_DURATION,
          userId: user.id,
        });
      }

      await Logging.save({
        action: LoggingActionEnum.UPDATE_TASK,
        userId: user.id,
      });

      return updatedTask;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteTask(id: string, user: ICurrentUser) {
    try {
      await Task.delete({ id, userId: user.id });
      await Logging.save({
        action: LoggingActionEnum.DELETE_TASK,
        userId: user.id,
      });
      return RESPONSE_OK;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getTasks(user: ICurrentUser, filters: { search?: string; priority?: string; status?: string; sort?: string }) {
    try {
      const { search, priority, status, sort } = filters;

      const queryBuilder = Task.createQueryBuilder("task").where("task.userId = :userId", { userId: user.id });

      if (search) {
        queryBuilder.andWhere("(task.name LIKE :search OR task.description LIKE :search)", { search: `%${search}%` });
      }

      if (priority) {
        queryBuilder.andWhere("task.priority = :priority", { priority });
      }

      if (status) {
        queryBuilder.andWhere("task.status = :status", { status });
      }

      queryBuilder.leftJoinAndSelect("task.focusDurations", "focusDurations");

      if (sort) {
        const [field, order] = sort.split(":"); // Example: "priority:ASC"
        queryBuilder.orderBy(`task.${field}`, order.toUpperCase() === "DESC" ? "DESC" : "ASC");
      }

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
