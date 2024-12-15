import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { SignInDto, SignInWithProviderDto, SignUpDto } from "shared_resources/dtos";
import { User } from "shared_resources/entities/user.entity";
import { FirebaseAuthService } from "shared_resources/firebase";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly firebaseAuthSerice: FirebaseAuthService) {}

  static generatePassword(length: number = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }

  async signUp(dto: SignUpDto) {
    try {
      const existedUser = await User.findOne({ where: { email: dto.email } });
      if (existedUser) {
        throw new Error("User already exists");
      }

      const userRecord = await this.firebaseAuthSerice.signUp(dto);

      const { uid, email } = userRecord;
      const { name } = dto;

      // Save user to database
      const user = await User.save({
        uid,
        email,
        name,
      });

      const token = await this.firebaseAuthSerice.generateCustomToken(uid, { id: user.id, name, email });

      return { token };
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
}
