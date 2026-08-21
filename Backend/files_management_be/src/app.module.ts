import { Module } from "@nestjs/common";
import { AppConfigModule } from "./config/app_config.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { RedisModule } from "./modules/redis/redis.module";
import { DriveModule } from "./modules/drive/drive.module";
import { FolderModule } from "./modules/folder/folder.module";
import { ACLModule } from "./modules/acl/acl.module";
import { LoggerModule } from './infrastructure/logger/logger.module';

@Module({
    imports: [AppConfigModule, PrismaModule, AuthModule, DriveModule, FolderModule, ACLModule, LoggerModule],
    controllers: [AppController]
})
export class AppModule { }