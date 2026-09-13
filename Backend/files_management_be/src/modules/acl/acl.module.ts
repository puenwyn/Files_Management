import { Module } from "@nestjs/common";
import { ACLService } from "./acl.service";
import { ACLController } from "./acl.controller";

@Module({
    imports: [],
    controllers: [ACLController],
    providers: [ACLService],
    exports: [ACLService]
})
export class ACLModule { }