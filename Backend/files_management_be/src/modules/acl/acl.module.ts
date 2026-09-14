import { Module } from "@nestjs/common";
import { ACLService } from "./acl.service";
import { ACLController } from "./acl.controller";
import { UserModule } from "../user/user.module";
import { ActivityModule } from "../activity/activity.module";

@Module({
    imports: [UserModule, ActivityModule],
    controllers: [ACLController],
    providers: [ACLService],
    exports: [ACLService]
})
export class ACLModule { }