import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "shared_resources/decorators";
import { FirebaseJwtAuthGuard } from "shared_resources/guards";
import { ICurrentUser } from "shared_resources/interfaces";

@Controller("buckets")
@UseGuards(FirebaseJwtAuthGuard)
export class BucketController {
  @Get()
  async getBuckets(@CurrentUser() user: ICurrentUser) {
    return user;
  }
}
