import { AuthService } from "./auth.service";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "shared_resources/decorators";
import { NewPasswordDto, SignInDto, SignInWithProviderDto, SignUpDto, VerifyOTPDto } from "shared_resources/dtos";
import { ResetPasswordRequestDto } from "shared_resources/dtos/reset-password-request.dto";
import { FirebaseJwtAuthGuard } from "shared_resources/guards";
import { ICurrentUser } from "shared_resources/interfaces";

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

  @Post("reset-password/otp")
  sendResetPasswordOTP(@Body() dto: ResetPasswordRequestDto) {
    return this.authService.sendResetPasswordOTP(dto);
  }

  @UseGuards(FirebaseJwtAuthGuard)
  @Post("reset-password")
  resetPassword(@CurrentUser() user: ICurrentUser, @Body() dto: NewPasswordDto) {
    return this.authService.resetPassword(user, dto);
  }
}
