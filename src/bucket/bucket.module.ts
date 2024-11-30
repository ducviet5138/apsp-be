import { BucketController } from "./bucket.controller";
import { BucketService } from "./bucket.service";
import { Module } from "@nestjs/common";

@Module({
  controllers: [BucketController],
  providers: [BucketService],
})
export class BucketModule {}
