import { AuthService } from "./auth.service";
import { Body, Controller, Post } from "@nestjs/common";
import { SignInDto, SignInWithProviderDto, SignUpDto } from "shared_resources/dtos";

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

  @Post("provider")
  signInWithProvider(@Body() dto: SignInWithProviderDto) {
    return this.authService.signInWithProvider(dto);
  }
}
