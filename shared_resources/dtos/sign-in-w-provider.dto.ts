import { IsNotEmpty, IsString } from "class-validator";

export class SignInWithProviderDto {
  @IsString()
  @IsNotEmpty()
  credential: string;

  @IsString()
  @IsNotEmpty({ message: "Provider is required" })
  provider: string;
}
