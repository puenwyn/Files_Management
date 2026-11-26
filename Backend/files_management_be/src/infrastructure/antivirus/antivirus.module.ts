import { Module } from "@nestjs/common";
import { AntivirusService } from "./antivirus.service";
import { AppConfigModule } from "src/config/app_config.module";
import { AntivirusController } from "./antivirus.controller";
import { StorageModule } from "../storage/storage.module";

@Module({
    imports: [AppConfigModule, StorageModule],
    controllers: [AntivirusController],
    providers: [AntivirusService],
    exports: [AntivirusService],
})
export class AntivirusModule { }