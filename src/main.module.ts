import { AIModule } from "./ai/ai.module";
import { AuthModule } from "./auth/auth.module";
import { BucketModule } from "./bucket/bucket.module";
import { TaskModule } from "./task/task.module";
import { UserModule } from "./user/user.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PostgresModule } from "shared_resources/database";

@Module({
  imports: [ConfigModule.forRoot(), PostgresModule, AuthModule, BucketModule, TaskModule, AIModule, UserModule],
})
export class MainModule {}
