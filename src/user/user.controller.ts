import { UserService } from "./user.service";
import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { CurrentUser } from "shared_resources/decorators";
import { UpdateUserProfileDto } from "shared_resources/dtos";
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

  @Put("profile")
  updateUserProfile(@CurrentUser() user: ICurrentUser, @Body() dto: UpdateUserProfileDto) {
    return this.userService.updateUserProfile(user, dto);
  }
}
