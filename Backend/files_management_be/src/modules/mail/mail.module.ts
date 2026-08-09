import { Module } from "@nestjs/common";
import { AppConfigModule } from "src/config/app_config.module";
import { MailService } from "./mail.service";

@Module({
    imports: [AppConfigModule],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule { }