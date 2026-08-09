import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { UserService } from "src/modules/user/user.service";
import { User } from "@prisma/client";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.access_token,
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
        });
    }

    async validate(payload: JwtPayload): Promise<Pick<User, "id">> {
        const user = await this.userService.findById(payload.sub);

        if (!user) throw new UnauthorizedException("User not found");

        return {
            id: user.id,
        };
    }
}