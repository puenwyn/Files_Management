import { Body, Controller, Delete, Get, Post, Req, UseGuards } from "@nestjs/common";
import { StarredService } from "./starred.service";
import { ResourceType } from "@prisma/client";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request.interface";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("starred")
export class StarredController {
    constructor(private readonly starredService: StarredService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async addStarred(
        @Req() req: AuthenticatedRequest,
        @Body("resourceId") resourceId: string,
        @Body("resourceType") resourceType: ResourceType,
    ) {
        return this.starredService.addStarred(req.user.id, resourceId, resourceType);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async removeStarred(
        @Req() req: AuthenticatedRequest,
        @Body("resourceId") resourceId: string,
        @Body("resourceType") resourceType: ResourceType,
    ) {
        return this.starredService.removeStarred(req.user.id, resourceId, resourceType);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getStarred(@Req() req: AuthenticatedRequest,) {
        return this.starredService.getStarred(req.user.id);
    }
}