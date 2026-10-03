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
import { ActivityModule } from "./modules/activity/activity.module";
import { WebSocketModule } from "./infrastructure/websocket/websocket.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { StarredModule } from "./modules/starred/starred.module";
import { StorageModule } from "./infrastructure/storage/storage.module";

@Module({
    imports: [
        AppConfigModule,
        PrismaModule,
        AuthModule,
        DriveModule,
        FolderModule,
        ACLModule,
        LoggerModule,
        ActivityModule,
        NotificationModule,
        StarredModule,
        WebSocketModule,
        StorageModule
    ],
    controllers: [AppController]
})
export class AppModule { }