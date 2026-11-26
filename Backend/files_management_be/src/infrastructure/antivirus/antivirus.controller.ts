import { Body, Controller, Get, Post } from "@nestjs/common";
import { AntivirusService } from "./antivirus.service";

@Controller("health")
export class AntivirusController {
    constructor(
        private readonly antivirusService: AntivirusService,
    ) { }

    @Get("clamav")
    async healthCheck() {
        return this.antivirusService.healthCheck();
    }

    // @Post("clamav/scan")
    // async scanFile(@Body("objectKey") objectKey: string) {
    //     return this.antivirusService.scanFile(objectKey);
    // }
}