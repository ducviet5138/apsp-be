import { IsString, IsStrongPassword } from "class-validator";

export class NewPasswordDto {
  @IsString()
  @IsStrongPassword()
  password: string;
}
