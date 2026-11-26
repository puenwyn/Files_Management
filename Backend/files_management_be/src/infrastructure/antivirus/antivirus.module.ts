import { Module } from "@nestjs/common";
import { AntivirusService } from "./antivirus.service";
import { AppConfigModule } from "src/config/app_config.module";
import { AntivirusController } from "./antivirus.controller";

@Module({
    imports: [AppConfigModule],
    controllers: [AntivirusController],
    providers: [AntivirusService],
    exports: [AntivirusService],
})
export class AntivirusModule { }