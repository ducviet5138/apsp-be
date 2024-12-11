import { AuthModule } from "./auth/auth.module";
import { BucketModule } from "./bucket/bucket.module";
import { TaskModule } from "./task/task.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PostgresModule } from "shared_resources/database";

@Module({
  imports: [ConfigModule.forRoot(), PostgresModule, AuthModule, BucketModule, TaskModule],
})
export class MainModule {}
