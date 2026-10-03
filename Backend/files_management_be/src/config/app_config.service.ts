import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvSchemaType } from "./env.schema";

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) { }

    get NODE_ENV(): 'development' | 'production' | 'test' {
        return this.configService.getOrThrow<EnvSchemaType['NODE_ENV']>('NODE_ENV');
    }

    get APP_PORT(): number {
        return this.configService.getOrThrow<EnvSchemaType['APP_PORT']>('APP_PORT');
    }

    get ENABLE_SWAGGER(): boolean {
        return this.configService.getOrThrow<EnvSchemaType['ENABLE_SWAGGER']>('ENABLE_SWAGGER');
    }

    get DB_NAME(): string {
        return this.configService.getOrThrow<EnvSchemaType['DB_NAME']>('DB_NAME');
    }

    get DB_HOST(): string {
        return this.configService.getOrThrow<EnvSchemaType['DB_HOST']>('DB_HOST');
    }

    get DB_PORT(): number {
        return this.configService.getOrThrow<EnvSchemaType['DB_PORT']>('DB_PORT');
    }

    get DB_USERNAME(): string {
        return this.configService.getOrThrow<EnvSchemaType['DB_USERNAME']>('DB_USERNAME');
    }

    get DB_PASSWORD(): string {
        return this.configService.getOrThrow<EnvSchemaType['DB_PASSWORD']>('DB_PASSWORD');
    }

    get DATABASE_URL(): string {
        return this.configService.getOrThrow<EnvSchemaType['DATABASE_URL']>('DATABASE_URL');
    }

    get JWT_ACCESS_SECRET(): string {
        return this.configService.getOrThrow<EnvSchemaType['JWT_ACCESS_SECRET']>(
            'JWT_ACCESS_SECRET'
        );
    }

    get JWT_ACCESS_EXPIRES_IN(): string {
        return this.configService.getOrThrow<EnvSchemaType['JWT_ACCESS_EXPIRES_IN']>(
            'JWT_ACCESS_EXPIRES_IN'
        );
    }

    get JWT_REFRESH_SECRET(): string {
        return this.configService.getOrThrow<EnvSchemaType['JWT_REFRESH_SECRET']>(
            'JWT_REFRESH_SECRET'
        );
    }

    get JWT_REFRESH_EXPIRES_IN(): string {
        return this.configService.getOrThrow<EnvSchemaType['JWT_REFRESH_EXPIRES_IN']>(
            'JWT_REFRESH_EXPIRES_IN'
        );
    }

    get JWT_HIDDEN_SECRET(): string {
        return this.configService.getOrThrow<EnvSchemaType['JWT_HIDDEN_SECRET']>(
            'JWT_HIDDEN_SECRET'
        );
    }

    get MAIL_HOST(): string {
        return this.configService.getOrThrow<EnvSchemaType['MAIL_HOST']>('MAIL_HOST');
    }

    get MAIL_PORT(): number {
        return this.configService.getOrThrow<EnvSchemaType['MAIL_PORT']>('MAIL_PORT');
    }

    get MAIL_SECURE(): boolean {
        return this.configService.getOrThrow<EnvSchemaType['MAIL_SECURE']>('MAIL_SECURE');
    }

    get MAIL_USER(): string {
        return this.configService.getOrThrow<EnvSchemaType['MAIL_USER']>('MAIL_USER');
    }

    get MAIL_PASSWORD(): string {
        return this.configService.getOrThrow<EnvSchemaType['MAIL_PASSWORD']>('MAIL_PASSWORD');
    }

    get REDIS_HOST(): string {
        return this.configService.getOrThrow<EnvSchemaType['REDIS_HOST']>("REDIS_HOST");
    }

    get REDIS_PORT(): number {
        return this.configService.getOrThrow<EnvSchemaType['REDIS_PORT']>("REDIS_PORT");
    }

    get REDIS_PASSWORD(): string | undefined {
        return this.configService.get<EnvSchemaType['REDIS_PASSWORD']>("REDIS_PASSWORD");
    }

    // get MAIL_FROM(): string {
    //     return this.configService.getOrThrow<EnvSchemaType['MAIL_FROM']>('MAIL_FROM');
    // }

    get MINIO_API_PORT(): number {
        return this.configService.getOrThrow<EnvSchemaType['MINIO_API_PORT']>("MINIO_API_PORT");
    }

    get MINIO_CONSOLE_PORT(): number {
        return this.configService.getOrThrow<EnvSchemaType['MINIO_CONSOLE_PORT']>("MINIO_CONSOLE_PORT");
    }

    get MINIO_ENDPOINT(): string {
        return this.configService.getOrThrow<EnvSchemaType['MINIO_ENDPOINT']>("MINIO_ENDPOINT");
    }

    get MINIO_ROOT_USER(): string {
        return this.configService.getOrThrow<EnvSchemaType['MINIO_ROOT_USER']>("MINIO_ROOT_USER");
    }

    get MINIO_ROOT_PASSWORD(): string {
        return this.configService.getOrThrow<EnvSchemaType['MINIO_ROOT_PASSWORD']>("MINIO_ROOT_PASSWORD");
    }

    get MINIO_BUCKET(): string {
        return this.configService.getOrThrow<EnvSchemaType['MINIO_BUCKET']>("MINIO_BUCKET");
    }
}