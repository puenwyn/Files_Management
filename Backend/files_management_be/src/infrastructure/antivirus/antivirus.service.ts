import { Injectable, OnModuleInit, ServiceUnavailableException } from "@nestjs/common";
import NodeClam from "clamscan";
import { AppConfigService } from "src/config/app_config.service";
import { StorageService } from "../storage/storage.service";
import { ScanStatus } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AntivirusService implements OnModuleInit {
    private clamscan: any;

    constructor(
        private readonly configService: AppConfigService,
        private readonly storageService: StorageService,
        private readonly prismaService: PrismaService
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

    async scanFile(fileVersionId: string, objectKey: string) {
        try {
            await this.prismaService.fileVersion.update({
                where: { id: fileVersionId },
                data: {
                    scanStatus: ScanStatus.SCANNING
                }
            });

            const stream = await this.storageService.getObjectStream(objectKey);
            const result = await this.clamscan.scanStream(stream);

            if (typeof result.isInfected !== "boolean")
                throw new Error("Unable to determine file scan result");

            const scanStatus = result.isInfected ? ScanStatus.THREAT : ScanStatus.VALID;
            await this.prismaService.fileVersion.update({
                where: { id: fileVersionId },
                data: {
                    scanStatus,
                },
            });

            return {
                fileVersionId,
                objectKey,
                status: scanStatus,
                isInfected: result.isInfected,
                viruses: result.viruses ?? []
            }
        } catch (error) {
            console.error("CLAMAV SCAN ERROR:", error);

            try {
                await this.prismaService.fileVersion.update({
                    where: { id: fileVersionId },
                    data: { scanStatus: ScanStatus.FAILED },
                });
            } catch (updateError) {
                console.error("UPDATE SCAN STATUS ERROR:", updateError);
            }

            throw new ServiceUnavailableException(
                error instanceof Error ? error.message : "Unable to scan file",
            );
        }
    }
}