import { TaskService } from "./task.service";
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "shared_resources/decorators";
import { CreateTaskDto, UpdateTaskDto } from "shared_resources/dtos";
import { FirebaseJwtAuthGuard } from "shared_resources/guards";
import { ICurrentUser } from "shared_resources/interfaces";

@Controller("tasks")
@UseGuards(FirebaseJwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@CurrentUser() user: ICurrentUser, @Body() dto: CreateTaskDto) {
    return this.taskService.createTask(user, dto);
  }

  @Put(":id")
  async updateTask(
    @Param("id", new ParseUUIDPipe()) id: string,
    @CurrentUser() user: ICurrentUser,
    @Body() dto: UpdateTaskDto
  ) {
    return this.taskService.updateTask(id, user, dto);
  }

  @Delete(":id")
  async deleteTask(@Param("id", new ParseUUIDPipe()) id: string, @CurrentUser() user: ICurrentUser) {
    return this.taskService.deleteTask(id, user);
  }

  @Get()
  async getTasks(
    @CurrentUser() user: ICurrentUser,
    @Query("search") search?: string,
    @Query("priority") priority?: string,
    @Query("status") status?: string,
    @Query("sort") sort?: string
  ) {
    return this.taskService.getTasks(user, { search, priority, status, sort });
  }
}
