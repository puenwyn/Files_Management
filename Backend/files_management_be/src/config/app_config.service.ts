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
}