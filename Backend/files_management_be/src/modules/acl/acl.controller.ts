import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ACLService } from "./acl.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ShareFolderDTO } from "./dtos/share-folder.dto";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request.interface";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("acl")
export class ACLController {
    constructor(private readonly aclService: ACLService) { }

    @Get("shared")
    @UseGuards(JwtAuthGuard)
    async getSharedFolders(
        @Req() req: AuthenticatedRequest
    ) {
        return this.aclService.getSharedFolders(req.user.id);
    }

    @Post(":id/share")
    @UseGuards(JwtAuthGuard)
    async sharedFolder(
        @Req() req: AuthenticatedRequest,
        @Param("id") id: string,
        @Body() dto: ShareFolderDTO
    ) {
        return this.aclService.sharedFolder(id, req.user.id, dto.targetUserId, dto.permission);
    }

    @Get("shared/:id/children")
    @UseGuards(JwtAuthGuard)
    async getSharedFolderChildren(
        @Req() req: AuthenticatedRequest,
        @Param("id") id: string,
    ) {
        return this.aclService.getSharedFolderChildren(
            id,
            req.user.id,
        );
    }

    @Get("folder/:folderId")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Get users shared with folder",
    })
    async getFolderUsers(
        @Param("folderId") folderId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.aclService.getFolderUsers(
            folderId,
            req.user.id,
        );
    }
}