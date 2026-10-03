import { Injectable } from "@nestjs/common";
import { S3Client } from "@aws-sdk/client-s3";
import { AppConfigService } from "src/config/app_config.service";

@Injectable()
export class StorageService {
    private readonly s3Client: S3Client;

    constructor(
        private readonly configService: AppConfigService,
    ) {
        this.s3Client = new S3Client({
            endpoint: this.configService.MINIO_ENDPOINT,
            region: "us-east-1",
            credentials: {
                accessKeyId: this.configService.MINIO_ROOT_USER,
                secretAccessKey: this.configService.MINIO_ROOT_PASSWORD,
            },
            forcePathStyle: true,
        });
    }
}