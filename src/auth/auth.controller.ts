import { AuthService } from "./auth.service";
import { Body, Controller, Post } from "@nestjs/common";
import { NewPasswordDto, SignInDto, SignInWithProviderDto, SignUpDto, VerifyOTPDto } from "shared_resources/dtos";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post("verify-otp")
  verifyOTP(@Body() dto: VerifyOTPDto) {
    return this.authService.verifyOTP(dto);
  }

  @Post("sign-in")
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post("provider")
  signInWithProvider(@Body() dto: SignInWithProviderDto) {
    return this.authService.signInWithProvider(dto);
  }

  @Post("reset-password")
  forgotPassword(@Body() dto: NewPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
