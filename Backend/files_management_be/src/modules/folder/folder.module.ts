import { Module } from "@nestjs/common";
import { FolderService } from "./folder.service";
import { FolderController } from "./folder.controller";
import { DriveModule } from "../drive/drive.module";

@Module({
    imports: [DriveModule],
    controllers: [FolderController],
    providers: [FolderService],
    exports: [FolderService]
})
export class FolderModule { }