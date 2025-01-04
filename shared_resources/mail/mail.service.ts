import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOtp(otp: string, email: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "OTP Verification",
        template: "otp",
        context: {
          otp,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
