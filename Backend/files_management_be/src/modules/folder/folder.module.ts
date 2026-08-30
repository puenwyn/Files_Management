import { Module } from "@nestjs/common";
import { FolderService } from "./folder.service";
import { FolderController } from "./folder.controller";
import { DriveModule } from "../drive/drive.module";
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [DriveModule, AuthModule],
    controllers: [FolderController],
    providers: [FolderService],
    exports: [FolderService]
})
export class FolderModule { }