import { Module } from "@nestjs/common";
import { FolderService } from "./folder.service";
import { FolderController } from "./folder.controller";
import { DriveModule } from "../drive/drive.module";
import { AuthModule } from "../auth/auth.module";
import { ACLModule } from "../acl/acl.module";
import { ActivityModule } from "../activity/activity.module";
import { NotificationModule } from "../notification/notification.module";

@Module({
    imports: [DriveModule, AuthModule, ACLModule, ActivityModule, NotificationModule],
    controllers: [FolderController],
    providers: [FolderService],
    exports: [FolderService]
})
export class FolderModule { }