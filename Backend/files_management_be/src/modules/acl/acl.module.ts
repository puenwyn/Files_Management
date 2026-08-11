import { Module } from "@nestjs/common";
import { ACLService } from "./acl.service";
import { ACLController } from "./acl.controller";
import { FolderModule } from "../folder/folder.module";

@Module({
    imports: [FolderModule],
    controllers: [ACLController],
    providers: [ACLService],
    exports: [ACLService]
})
export class ACLModule { }