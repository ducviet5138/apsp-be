import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { RedisClientType } from "@redis/client";
import { isNil } from "lodash";
import { createClient, RedisClientOptions } from "redis";
import { REDIS_PROVIDER } from "shared_resources/const";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly logger = new Logger(this.constructor.name);

  constructor(@Inject(REDIS_PROVIDER) private readonly options: RedisClientOptions) {}

  async onModuleInit() {
    if (!this.client) {
      this.client = createClient(this.options) as unknown as RedisClientType;
      await this.client.connect();
      this.logger.log("Redis connected");
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.disconnect();
    }
  }

  async set(key: string, value: any, ttlInSecond = 300) {
    try {
      const stringValue = JSON.stringify(value);
      await this.client.set(key, stringValue, { EX: ttlInSecond });
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async get(key: string) {
    try {
      const value = await this.client.get(key);
      return !isNil(value) && JSON.parse(value);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async delete(key: string) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
