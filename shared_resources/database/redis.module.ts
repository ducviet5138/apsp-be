import { RedisService } from "./redis.service";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisClientOptions } from "redis";
import { REDIS_PROVIDER } from "shared_resources/const";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_PROVIDER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RedisClientOptions => ({
        socket: {
          host: configService.get("REDIS_HOST"),
          port: configService.get("REDIS_PORT"),
        },
      }),
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
