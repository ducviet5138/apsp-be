import { UserService } from "./user.service";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "shared_resources/decorators";
import { FirebaseJwtAuthGuard } from "shared_resources/guards";
import { ICurrentUser } from "shared_resources/interfaces";

@Controller("users")
@UseGuards(FirebaseJwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  getUserProfile(@CurrentUser() user: ICurrentUser) {
    return this.userService.getUserProfile(user);
  }
}
