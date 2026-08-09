import { Module } from "@nestjs/common";
import { AppConfigModule } from "./config/app_config.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { RedisModule } from "./modules/redis/redis.module";

@Module({
    imports: [AppConfigModule, PrismaModule, AuthModule],
    controllers: [AppController]
})
export class AppModule { }