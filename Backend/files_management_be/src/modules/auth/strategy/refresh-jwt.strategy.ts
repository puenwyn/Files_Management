import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/modules/user/user.service";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(
        configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.refresh_token,
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>(
                "JWT_REFRESH_SECRET",
            ),
        });
    }

    async validate(payload: JwtPayload) {
        console.log("REFRESH PAYLOAD:", payload);

        const user = await this.userService.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        return {
            id: user.id,
            jti: payload.jti,
        };
    }
}