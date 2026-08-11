import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RefreshTokenModule } from "../refresh-token/refresh-token.module";
import { RefreshStrategy } from "./strategy/refresh-jwt.strategy";
import { MailModule } from "../mail/mail.module";
import { RedisModule } from "../redis/redis.module";
import { DriveModule } from "../drive/drive.module";

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
                signOptions: {
                    expiresIn: configService.getOrThrow<string>("JWT_ACCESS_EXPIRES_IN") as any,
                },
            }),
        }),
        UserModule,
        RefreshTokenModule,
        MailModule,
        RedisModule,
        DriveModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtAuthGuard, RefreshStrategy],
    exports: [JwtModule]
})
export class AuthModule { }