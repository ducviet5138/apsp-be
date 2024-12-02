import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { SignUpDto } from "shared_resources/dtos";
import { SignInDto } from "shared_resources/dtos/sign-in.dto";
import { User } from "shared_resources/entities/user.entity";
import { FirebaseAuthService } from "shared_resources/firebase";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly firebaseAuthSerice: FirebaseAuthService) {}

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
      await User.save({
        uid,
        email,
        name,
      });

      const token = await this.firebaseAuthSerice.generateCustomToken(uid, { name, email });

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
