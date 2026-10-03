import { Module } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { AppConfigModule } from "src/config/app_config.module";
import { StorageController } from "./storage.controller";

@Module({
  imports: [AppConfigModule],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule { }