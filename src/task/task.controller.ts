import { Controller, UseGuards } from "@nestjs/common";
import { FirebaseJwtAuthGuard } from "shared_resources/guards";

@Controller("tasks")
@UseGuards(FirebaseJwtAuthGuard)
export class TaskController {
  // Missing profile id in task
}
