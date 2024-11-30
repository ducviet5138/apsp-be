import { MainModule } from "./main.module";
import { Logger } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { ExceptionHandlerInterceptor, TransformResponseInterceptor } from "shared_resources/interceptors";
import { ThrowFirstErrorValidationPipe } from "shared_resources/pipes";

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  const port = process.env.PORT ?? 3000;

  app.useGlobalInterceptors(new TransformResponseInterceptor(new Reflector()));
  app.useGlobalInterceptors(new ExceptionHandlerInterceptor());
  app.useGlobalPipes(ThrowFirstErrorValidationPipe);
  await app.listen(port);

  Logger.log(`🚀 Main application is running on: http://localhost:${port}`);
}
bootstrap();
