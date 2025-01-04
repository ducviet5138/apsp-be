import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { RedisService } from "shared_resources/database";
import { NewPasswordDto, SignInDto, SignInWithProviderDto, SignUpDto, VerifyOTPDto } from "shared_resources/dtos";
import { User } from "shared_resources/entities/user.entity";
import { OTPActionEnum } from "shared_resources/enums";
import { FirebaseAuthService } from "shared_resources/firebase";
import { MailService } from "shared_resources/mail";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly firebaseAuthSerice: FirebaseAuthService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService
  ) {}

  static generatePassword(length: number = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }

  static generateOtp(length: number = 6) {
    const chars = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      otp += chars[randomIndex];
    }
    return otp;
  }

  async signUp(dto: SignUpDto) {
    try {
      const existedUser = await User.findOne({ where: { email: dto.email } });
      if (existedUser) {
        throw new Error("User already exists");
      }

      // Save user to redis before confirming email
      await this.redisService.set(`${OTPActionEnum.SIGN_UP}-${dto.email}`, JSON.stringify(dto));
      const otp = AuthService.generateOtp();
      await this.redisService.set(`${OTPActionEnum.SIGN_UP}-otp-${dto.email}`, otp);

      // Send email
      await this.mailService.sendOtp(otp, dto.email);

      return OTPActionEnum.SIGN_UP;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async verifyOTP(dto: VerifyOTPDto) {
    try {
      if (dto.action === OTPActionEnum.SIGN_UP) {
        const savedOtp = await this.redisService.get(`${OTPActionEnum.SIGN_UP}-otp-${dto.email}`);
        if (!savedOtp || savedOtp !== dto.otp) {
          throw new Error("Invalid OTP");
        }

        const rawUserDto = await this.redisService.get(`${OTPActionEnum.SIGN_UP}-${dto.email}`);
        const userDto: SignUpDto = JSON.parse(rawUserDto);

        const userRecord = await this.firebaseAuthSerice.signUp(userDto);

        const { uid, email } = userRecord;
        const { name } = userDto;

        // Save user to database
        const user = await User.save({
          uid,
          email,
          name,
        });

        const token = await this.firebaseAuthSerice.generateCustomToken(uid, { id: user.id, name, email });

        this.redisService.delete(`${OTPActionEnum.SIGN_UP}-${dto.email}`);
        this.redisService.delete(`${OTPActionEnum.SIGN_UP}-otp-${dto.email}`);

        return { token };
      } else if (dto.action === OTPActionEnum.RESET_PASSWORD) {
        const savedOtp = await this.redisService.get(`${OTPActionEnum.RESET_PASSWORD}-otp-${dto.email}`);
        if (!savedOtp || savedOtp !== dto.otp) {
          throw new Error("Invalid OTP");
        }

        const rawNewPasswordDto = await this.redisService.get(`${OTPActionEnum.RESET_PASSWORD}-${dto.email}`);
        const newPasswordDto: NewPasswordDto = JSON.parse(rawNewPasswordDto);

        const databaseUser = await User.findOne({ where: { email: dto.email } });
        await this.firebaseAuthSerice.updatePassword(databaseUser.uid, newPasswordDto.password);

        const token = await this.firebaseAuthSerice.generateCustomToken(databaseUser.uid, {
          id: databaseUser.id,
          name: databaseUser.name,
          email: databaseUser.email,
        });

        this.redisService.delete(`${OTPActionEnum.RESET_PASSWORD}-${dto.email}`);
        this.redisService.delete(`${OTPActionEnum.RESET_PASSWORD}-otp-${dto.email}`);

        return { token };
      } else {
        throw new Error("Invalid action");
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async signIn(dto: SignInDto) {
    try {
      const existedUser = await User.findOne({ where: { email: dto.email } });
      if (!existedUser) {
        throw new Error("User not found");
      }

      const firebaseUser = await this.firebaseAuthSerice.verifyUser(dto.email, dto.password);
      const databaseUser = await User.findOne({ where: { email: dto.email, uid: firebaseUser.localId } });
      if (!firebaseUser || !databaseUser) {
        throw new Error("Invalid credentials");
      }

      const token = await this.firebaseAuthSerice.generateCustomToken(firebaseUser.localId, {
        id: databaseUser.id,
        name: databaseUser.name,
        email: databaseUser.email,
      });
      return { token };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async signInWithProvider(dto: SignInWithProviderDto) {
    try {
      const { credential, provider } = dto;
      const firebaseUser = await this.firebaseAuthSerice.verifyOAuthCredential(credential, provider);
      const { email } = firebaseUser;
      let databaseUser = await User.findOne({
        where: { email },
      });

      // If user not exist in database
      if (!databaseUser) {
        const generatedPassword = AuthService.generatePassword();
        await this.firebaseAuthSerice.linkWithProvider(firebaseUser.idToken, firebaseUser.email, generatedPassword);
        databaseUser = await User.save({
          email,
          uid: firebaseUser.localId,
        });
        await this.firebaseAuthSerice.setEmailVerifed(databaseUser.uid);
      }

      // Generate token
      const token = await this.firebaseAuthSerice.generateCustomToken(databaseUser.uid, {
        id: databaseUser.id,
        name: databaseUser.name,
        email: databaseUser.email,
      });

      return { token };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async resetPassword(dto: NewPasswordDto) {
    try {
      const databaseUser = await User.findOne({ where: { email: dto.email } });
      if (!databaseUser) {
        throw new Error("User not found");
      }

      // Save user to redis before confirming email
      await this.redisService.set(`${OTPActionEnum.RESET_PASSWORD}-${dto.email}`, JSON.stringify(dto));
      const otp = AuthService.generateOtp();
      await this.redisService.set(`${OTPActionEnum.RESET_PASSWORD}-otp-${dto.email}`, otp);

      // Send email
      await this.mailService.sendOtp(otp, dto.email);

      return OTPActionEnum.RESET_PASSWORD;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
