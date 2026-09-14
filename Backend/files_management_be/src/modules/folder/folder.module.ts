import { Module } from "@nestjs/common";
import { FolderService } from "./folder.service";
import { FolderController } from "./folder.controller";
import { DriveModule } from "../drive/drive.module";
import { AuthModule } from "../auth/auth.module";
import { ACLModule } from "../acl/acl.module";
import { ActivityModule } from "../activity/activity.module";

@Module({
    imports: [DriveModule, AuthModule, ACLModule, ActivityModule],
    controllers: [FolderController],
    providers: [FolderService],
    exports: [FolderService]
})
export class FolderModule { }