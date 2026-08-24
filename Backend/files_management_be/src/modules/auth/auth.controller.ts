import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dtos/register.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LoginDTO } from "./dtos/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { User } from "@prisma/client";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { ForgotPasswordDTO } from "./dtos/forgot-password.dto";
import { VerifyOtpDTO } from "./dtos/verify-otp.dto";
import { ResetPasswordDTO } from "./dtos/reset-password.dto";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request.interface";

export interface RequestWithUser extends Request {
    user: Pick<User, "id">;
}

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly loggerService: AppLoggerService
    ) { }

    @Post("register")
    @ApiOperation({ summary: "Register a new user account", })
    @ApiResponse({ status: HttpStatus.CREATED, description: "User registered successfully." })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: "Username or email already exists." })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "An unexpected error occurred." })
    register(@Body() dto: RegisterDTO) {
        return this.authService.register(dto);
    }

    @Post("login")
    @ApiOperation({ summary: "Login" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "logged in successfully." })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Invalid username or password!" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "An unexpected error occurred." })
    async login(
        @Body() dto: LoginDTO,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const { accessToken, refreshToken } = await this.authService.login(dto, req);

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 5 * 60 * 1000,
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            message: "Logged in successfully!"
        }
    }

    @Post("refresh")
    @UseGuards(JwtRefreshGuard)
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken } =
            await this.authService.refresh(
                (req.user as { id: string }).id,
                req,
            );

        console.log("SET NEW COOKIE:", refreshToken);

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1 * 60 * 1000,
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            message: "Refresh successfully!",
        };
    }

    @Get("profile")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Get current user profile" })
    @ApiResponse({ status: HttpStatus.OK, description: "Get profile successfully." })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized." })
    getProfile(
        @Req() req: AuthenticatedRequest
    ) {
        return this.authService.getProfile(req.user.id);
    }

    @Get("devices")
    @UseGuards(JwtAuthGuard)
    getDevices(@Req() req: Request) {
        return this.authService.getDevices((req.user as User).id);
    }

    @Post("logout")
    @UseGuards(JwtAuthGuard)
    @UseGuards(JwtRefreshGuard)
    async logout(
        @Req() req: RequestWithUser,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.logout(req.user.id, req);

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        return {
            message: "Logout successfully",
        };
    }

    @Post("logout-devices")
    @UseGuards(JwtAuthGuard)
    @UseGuards(JwtRefreshGuard)
    async logoutAllDevices(
        @Req() req: RequestWithUser,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.logoutAllDevices(req.user.id, req);
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        return {
            message: "Logout successfully",
        };
    }

    @Post("forgot-password")
    @ApiOperation({ summary: "Send OTP to email" })
    @ApiResponse({ status: HttpStatus.OK, description: "Send OTP successfully!" })
    async forgotPassword(@Body() dto: ForgotPasswordDTO) {
        return this.authService.forgotPassword(dto.email);
    }

    @Post("verify-otp")
    @ApiOperation({ summary: "Verify forgot password OTP", })
    @ApiResponse({ status: HttpStatus.OK, description: "OTP verified successfully.", })
    async verifyOTP(@Body() dto: VerifyOtpDTO) {
        return this.authService.verifyOTP(dto.email, dto.otp);
    }

    @Post("reset-password")
    @ApiOperation({ summary: "Reset account password", })
    @ApiResponse({ status: HttpStatus.OK, description: "Reset password successfully!", })
    async resetPassword(@Body() dto: ResetPasswordDTO) {
        return this.authService.resetPassword(dto.email, dto.newPassword);
    }

    private name = AuthController.name;

    @Get("abc/hello")
    async test() {

        this.loggerService.log("Xin chào bạn!", this.name);
        return "";
    }
}