import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import * as express from "express";
import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dtos/register.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LoginDTO } from "./dtos/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

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
        @Res({ passthrough: true }) res: express.Response
    ) {
        const { accessToken } = await this.authService.login(dto);

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });

        return {
            message: "Logged in successfully!"
        }
    }

    @Get("profile")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Get current user profile" })
    @ApiResponse({ status: HttpStatus.OK, description: "Get profile successfully." })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized." })
    profile(@Req() req: any) {
        return req.user;
    }
}