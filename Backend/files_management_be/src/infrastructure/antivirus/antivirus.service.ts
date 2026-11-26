import { Injectable } from "@nestjs/common";
import NodeClam from "clamscan";
import { AppConfigService } from "src/config/app_config.service";

@Injectable()
export class AntivirusService {
    private clamscan: any;

    constructor(
        private readonly configService: AppConfigService,
    ) { }

    async onModuleInit() {
        this.clamscan = await new NodeClam().init({
            clamdscan: {
                host: this.configService.CLAMAV_HOST ?? "127.0.0.1",
                port: this.configService.CLAMAV_PORT,
                timeout: 60000,
                localFallback: false,
                active: true,
            },
            preference: "clamdscan",
        });
    }

    async healthCheck() {
        const client = await this.clamscan.ping();

        client.end();

        return {
            status: "ok",
            service: "clamav",
        };
    }
}