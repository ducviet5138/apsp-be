import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class NewPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
