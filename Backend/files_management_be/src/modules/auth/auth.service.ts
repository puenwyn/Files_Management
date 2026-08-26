import { RegisterDTO } from "./dtos/register.dto";
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { LoginDTO } from "./dtos/login.dto";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenService } from "../refresh-token/refresh-token.service";
import { Request } from "express";
import { UAParser } from "ua-parser-js";
import { RefreshToken } from "@prisma/client";
import { randomUUID } from "crypto";
import { MailService } from "../mail/mail.service";
import { RedisService } from "../redis/redis.service";
import { DriveService } from "../drive/drive.service";
import { StringValue } from "ms";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly redisService: RedisService,
        private readonly driveService: DriveService
    ) { }

    private async generateAccessToken(userId: string) {
        return this.jwtService.signAsync({
            sub: userId,
            jti: randomUUID()
        });
    }

    private async generateRefreshToken(userId: string, expiresIn: StringValue) {
        return this.jwtService.signAsync(
            {
                sub: userId,
                jti: randomUUID()
            },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn,
            },
        );
    }

    async register(dto: RegisterDTO) {
        const existedUsername = await this.userService.findByUsername(dto.username);
        const existedEmail = await this.userService.findByEmail(dto.email);

        if (existedUsername) throw new ConflictException("This username already exists!");
        if (existedEmail) throw new ConflictException("This email already exists!");

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.userService.create({
            fullName: dto.fullName,
            username: dto.username,
            email: dto.email,
            hashedPassword,
        });

        await this.driveService.create({
            driveName: "My Drive",
            totalSpace: 10 * 1024 * 1024 * 1024,
            usedSpace: 0,
            usedPercent: 0,
            user: {
                connect: {
                    id: user.id,
                },
            },
        });
        return {
            message: "Register successfully"
        };
    }

    async login(dto: LoginDTO, req: Request) {
        const user = await this.userService.findByUsername(dto.username);
        if (!user) throw new UnauthorizedException("Invalid username or password!");

        const isMatched = await bcrypt.compare(
            dto.password,
            user.hashedPassword
        );
        if (!isMatched) throw new UnauthorizedException("Invalid username or password!");

        const refreshExpiresIn: StringValue = dto.rememberMe
            ? process.env.JWT_REFRESH_EXPIRES_IN as StringValue
            : "1d";

        const accessToken = await this.generateAccessToken(user.id);
        const refreshToken = await this.generateRefreshToken(user.id, refreshExpiresIn);

        console.log("LOGIN REFRESH:");
        console.log(refreshToken);

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        const parser = new UAParser(req.headers["user-agent"]);
        const result = parser.getResult();

        const browser = result.browser.name ?? "Unknown Browser";
        const os = result.os.name ?? "Unknown OS";
        const deviceName = result.device.model ?? `${browser} on ${os}`;

        const ipAddress = req.ip ?? req.socket.remoteAddress ?? "Unknown";

        const userAgent = req.headers["user-agent"] ?? "Unknown";

        await this.refreshTokenService.create({
            hashedRefreshToken,
            deviceName,
            ipAddress,
            userAgent,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            user: {
                connect: {
                    id: user.id,
                },
            },
        })

        return {
            accessToken,
            refreshToken,
            refreshExpiresIn
        };
    }

    async refresh(userId: string, req: Request) {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            throw new UnauthorizedException("Refresh token is not found!");
        }

        const refreshTokens =
            await this.refreshTokenService.findAllByUserId(userId);

        let currentToken: RefreshToken | null = null;

        for (const token of refreshTokens) {

            const isMatched = await bcrypt.compare(
                refreshToken,
                token.hashedRefreshToken,
            );

            if (isMatched && !token.isRevoked) {
                console.log("FOUND VALID TOKEN");
                currentToken = token;
            }
        }

        if (!currentToken) {
            throw new UnauthorizedException("Invalid refresh token!");
        }

        if (currentToken.isRevoked) {
            throw new UnauthorizedException("Refresh token has been revoked!");
        }

        if (currentToken.expiresAt < new Date()) {
            throw new UnauthorizedException("Refresh token has expired!");
        }

        const remainingTime =
            currentToken.expiresAt.getTime() - Date.now();

        const refreshExpiresIn =
            `${remainingTime}ms` as StringValue;

        const newAccessToken = await this.generateAccessToken(userId);
        const newRefreshToken = await this.generateRefreshToken(
            userId,
            refreshExpiresIn,
        );

        const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

        await this.refreshTokenService.update(currentToken.id, {
            isRevoked: true,
        });

        await this.refreshTokenService.create({
            hashedRefreshToken,
            deviceName: currentToken.deviceName,
            ipAddress: currentToken.ipAddress,
            userAgent: currentToken.userAgent,
            expiresAt: currentToken.expiresAt,
            user: {
                connect: {
                    id: userId,
                },
            },
        });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            refreshExpiresIn
        };
    }

    async getProfile(userId: string) {
        return this.userService.getProfile(userId);
    }

    async getDevices(userId: string) {
        return this.refreshTokenService.findByUserId(userId);
    }

    async logout(userId: string, req: Request) {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) return;

        const refreshTokens =
            await this.refreshTokenService.findAllByUserId(userId);

        for (const token of refreshTokens) {
            if (
                !token.isRevoked &&
                await bcrypt.compare(refreshToken, token.hashedRefreshToken)
            ) {
                await this.refreshTokenService.deleteById(token.id);
                break;
            }
        }
    }

    async logoutSession(userId: string, sessionId: string) {
        const session = await this.refreshTokenService.findById(sessionId);

        if (!session) {
            throw new NotFoundException("Session not found",);
        }
        if (session.userId !== userId) {
            throw new ForbiddenException("You cannot logout this device",);
        }
        await this.refreshTokenService.deleteById(
            sessionId,
        );
    }

    async logoutAllDevices(userId: string, req: Request) {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            return;
        }

        const tokens =
            await this.refreshTokenService.findAllByUserId(userId);

        for (const token of tokens) {
            await this.refreshTokenService.deleteById(token.id)
        }

    }

    private generateOTP(): string {
        return Math.floor(
            100000 + Math.random() * 900000
        ).toString();
    }

    async forgotPassword(email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return {
                message: "If this email exists, an OTP has been sent.",
            };
        }

        const otp = this.generateOTP();

        const key = `forgot-password:otp:${email}`;

        await this.redisService.set(key, otp, 5 * 60);

        await this.mailService.sendOTP(email, otp);

        return {
            message: "If this email exists, an OTP has been sent.",
        };

    }

    async resetPassword(
        email: string,
        otp: string,
        newPassword: string,
    ) {
        const key = `forgot-password:otp:${email}`;

        const storedOTP = await this.redisService.get(key);

        if (!storedOTP) throw new UnauthorizedException("OTP is expired or invalid!");

        if (storedOTP !== otp) throw new UnauthorizedException("OTP is invalid");

        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException(
                "Unable to reset password!",
            );
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10,
        );

        await this.userService.update(user.id, {
            hashedPassword,
        });

        await this.redisService.delete(key);

        return {
            message: "Password reset successfully!",
        };
    }
}