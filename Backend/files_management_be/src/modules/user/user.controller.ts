import { Body, Controller, Get, HttpStatus, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request.interface";
import { UpdateProfileDTO } from "./dtos/update-profile.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Patch("profile")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Update your profile information" })
    @ApiResponse({ status: HttpStatus.OK, description: "Update profile information successfully." })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User not found" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "An unexpected error occurred." })
    async updateProfile(
        @Req() req: AuthenticatedRequest,
        @Body() dto: UpdateProfileDTO
    ) {
        return this.userService.updateProfile(req.user.id, dto);
    }

    @Get("shareable")
    @UseGuards(JwtAuthGuard)
    async findShareableUsers(
        @Req() req: AuthenticatedRequest,
        @Query("keyword") keyword?: string
    ) {
        return this.userService.findShareableUsers(req.user.id, keyword);
    }
}