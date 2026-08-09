import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis"
import { AppConfigService } from "src/config/app_config.service"

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly redis: Redis

    constructor(private readonly appConfig: AppConfigService) {
        this.redis = new Redis({
            host: this.appConfig.REDIS_HOST,
            port: this.appConfig.REDIS_PORT,
            password: this.appConfig.REDIS_PASSWORD || undefined
        });
    }

    async set(key: string, value: string, ttlSeconds?: number) {
        if (ttlSeconds !== undefined) {
            return this.redis.set(key, value, "EX", ttlSeconds);
        }
        return this.redis.set(key, value);
    }

    async get(key: string) {
        return this.redis.get(key);
    }

    async delete(key: string) {
        return this.redis.del(key);
    }

    async exists(key: string) {
        return this.redis.exists(key);
    }

    async expire(key: string, seconds: number) {
        return this.redis.expire(key, seconds);
    }

    async onModuleDestroy() {
        await this.redis.quit();
    }
}