import { IsEmail, IsEnum, IsString } from "class-validator";
import { OTPActionEnum } from "shared_resources/enums";

export class VerifyOTPDto {
  @IsString()
  otp: string;

  @IsEmail()
  email: string;

  @IsEnum(OTPActionEnum)
  action: OTPActionEnum;
}
