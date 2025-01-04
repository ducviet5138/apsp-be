import { IsEmail, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsUUID()
  avatar: string;
}
