import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Module } from "@nestjs/common";
import { FirebaseAuthModule } from "shared_resources/firebase";
import { FirebaseStrategy } from "shared_resources/strategies";

@Module({
  controllers: [AuthController],
  providers: [AuthService, FirebaseStrategy],
  imports: [FirebaseAuthModule],
})
export class AuthModule {}
