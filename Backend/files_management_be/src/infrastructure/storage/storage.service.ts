import { Injectable } from "@nestjs/common";
import { HeadBucketCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

    async healthCheck() {
        try {
            await this.s3Client.send(
                new HeadBucketCommand({
                    Bucket: this.configService.MINIO_BUCKET,
                }),
            );

            return {
                status: "ok",
                service: "minio",
                bucket: this.configService.MINIO_BUCKET,
            };
        } catch (error) {
            console.error("MINIO HEALTH CHECK ERROR:", error);

            return {
                status: "error",
                service: "minio",
                bucket: this.configService.MINIO_BUCKET,
                message: error instanceof Error
                    ? error.message
                    : String(error),
            };
        }
    }

    async generateUploadUrl(
        sha256: string,
        mimeType: string,
    ) {
        const objectKey = `uploads/${sha256}`;

        const command = new PutObjectCommand({
            Bucket: this.configService.MINIO_BUCKET,
            Key: objectKey,
            ContentType: mimeType,
        });

        const url = await getSignedUrl(
            this.s3Client,
            command,
            {
                expiresIn: 60,
            },
        );

        return {
            url,
            objectKey,
            expiresIn: 60,
        };
    }

    async checkObject(objectKey: string) {
        try {
            const result = await this.s3Client.send(
                new HeadObjectCommand({
                    Bucket: this.configService.MINIO_BUCKET,
                    Key: objectKey
                }),
            );
            return {
                exists: true,
                size: result.ContentLength ?? 0,
                contentType: result.ContentType ?? null,
            };
        } catch (error) {
            return {
                exists: false,
                size: 0,
                contentType: null,
            };
        }
    }
}