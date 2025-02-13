import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Module } from "@nestjs/common";
import { RedisModule } from "shared_resources/database";
import { FirebaseAuthModule } from "shared_resources/firebase";
import { MailModule } from "shared_resources/mail";
import { FirebaseStrategy } from "shared_resources/strategies";

@Module({
  controllers: [AuthController],
  providers: [AuthService, FirebaseStrategy],
  imports: [FirebaseAuthModule, RedisModule, MailModule],
})
export class AuthModule {}
