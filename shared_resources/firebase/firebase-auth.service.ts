import * as firebaseConfig from "../../firebase-adminsdk.json";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosInstance } from "axios";
import { credential } from "firebase-admin";
import { App, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { SignUpDto } from "shared_resources/dtos";
import { genericHttpConsumer } from "shared_resources/utils";

@Injectable()
export class FirebaseAuthService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly app: App;
  private readonly httpService: AxiosInstance;
  private readonly firebaseUrl = "https://identitytoolkit.googleapis.com/v1";
  private readonly apiKey: string;
  private readonly requestUri: string;

  constructor(private readonly configService: ConfigService) {
    // Guide: https://blog.logrocket.com/using-firebase-authentication-in-nestjs-apps/
    const firebase_params = {
      type: firebaseConfig.type,
      projectId: firebaseConfig.project_id,
      privateKeyId: firebaseConfig.private_key_id,
      privateKey: firebaseConfig.private_key,
      clientEmail: firebaseConfig.client_email,
      clientId: firebaseConfig.client_id,
      authUri: firebaseConfig.auth_uri,
      tokenUri: firebaseConfig.token_uri,
      authProviderX509CertUrl: firebaseConfig.auth_provider_x509_cert_url,
      clientC509CertUrl: firebaseConfig.client_x509_cert_url,
    };

    this.apiKey = this.configService.get("FIREBASE_API_KEY");
    this.requestUri = this.configService.get("REQUEST_URI");
    this.httpService = genericHttpConsumer();

    this.app = initializeApp({
      credential: credential.cert(firebase_params),
    });
  }

  signUp(dto: SignUpDto) {
    try {
      const auth = getAuth(this.app);
      return auth.createUser({
        email: dto.email,
        password: dto.password,
        emailVerified: true,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async verifyUser(email: string, password: string) {
    try {
      const response = await this.httpService.post(
        `${this.firebaseUrl}/accounts:signInWithPassword?key=${this.apiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      );
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async generateCustomToken(uid: string, data: any) {
    const formattedData = data ? { data } : {};
    return getAuth(this.app).createCustomToken(uid, formattedData);
  }

  async getIdToken(token: string) {
    try {
      const response = await this.httpService.post(
        `${this.firebaseUrl}/accounts:signInWithCustomToken?key=${this.apiKey}`,
        {
          token,
          returnSecureToken: true,
        }
      );
      return response.data.idToken;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async verifyCustomToken(token: string) {
    try {
      const idToken = await this.getIdToken(token);
      const auth = getAuth(this.app);
      return auth.verifyIdToken(idToken);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async verifyOAuthCredential(credential: string, providerId: string) {
    try {
      const response = await this.httpService.post(`${this.firebaseUrl}/accounts:signInWithIdp?key=${this.apiKey}`, {
        requestUri: this.requestUri,
        postBody: `id_token=${credential}&providerId=${providerId}`,
        returnSecureToken: true,
      });
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async linkWithProvider(idToken: string, email: string, password: string) {
    try {
      const response = await this.httpService.post(`${this.firebaseUrl}/accounts:update?key=${this.apiKey}`, {
        idToken,
        email,
        password,
        returnSecureToken: false,
      });
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async setEmailVerifed(uid: string) {
    try {
      const auth = getAuth(this.app);
      await auth.updateUser(uid, {
        emailVerified: true,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updatePassword(uid: string, password: string) {
    try {
      const auth = getAuth(this.app);
      await auth.updateUser(uid, {
        password,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
