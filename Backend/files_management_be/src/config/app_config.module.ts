import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvSchema } from "./env.schema";
import { AppConfigService } from "./app_config.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: (env) => EnvSchema.parse(env)
        })
    ],
    providers: [AppConfigService],
    exports: [AppConfigService]
})
export class AppConfigModule { }