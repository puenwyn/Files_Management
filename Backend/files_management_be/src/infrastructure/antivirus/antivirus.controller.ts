import { Controller, Get } from "@nestjs/common";
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
}