import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ACLService } from "./acl.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ShareFolderDTO } from "./dtos/share-folder.dto";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request.interface";

@Controller("acl")
export class ACLController {
    constructor(private readonly aclService: ACLService) {}

    @Post(":id/share")
    @UseGuards(JwtAuthGuard)
    async sharedFolder(
        @Req() req: AuthenticatedRequest,
        @Param("id") id: string,
        @Body() dto: ShareFolderDTO
    ) {
        return this.aclService.sharedFolder(id, req.user.id, dto.targetUserId, dto.permission);
    }
}