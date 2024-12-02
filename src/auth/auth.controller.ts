import { AuthService } from "./auth.service";
import { Body, Controller, Post } from "@nestjs/common";
import { SignUpDto } from "shared_resources/dtos";
import { SignInDto } from "shared_resources/dtos/sign-in.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post("sign-in")
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}
