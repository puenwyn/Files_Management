import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { FolderService } from "./folder.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateFolderDTO } from "./dtos/create-folder.dto";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request.interface";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RenameFolderDTO } from "./dtos/rename-folder.dto";
import { HideFolderDTO } from "./dtos/hide-folder.dto";
import { ShowFolderDTO } from "./dtos/show-folder.dto";
import { AuthService } from "../auth/auth.service";

@Controller("folder")
export class FolderController {
    constructor(
        private readonly folderService: FolderService,
        private readonly authService: AuthService
    ) { }

    @Get("drive/:id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Get root folders of drive"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Get root folders successfully!" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Drive is not found or it's your own!" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    async getDriveFolders(
        @Req() req: AuthenticatedRequest,
        @Param("id") id: string
    ) {
        const showHidden = await this.authService.verifyHiddenToken(
            req.user.id,
            req.cookies.hidden_token
        );
        return this.folderService.getDriveFolders(req.user.id, id, showHidden);
    }

    @Get(":id/children")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Get root folders of drive"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Get root folders successfully!" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Folder is not found!" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "You are forbidden!" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    async getFolderChildrens(
        @Req() req: AuthenticatedRequest,
        @Param("id") id: string
    ) {
        const showHidden = await this.authService.verifyHiddenToken(
            req.user.id,
            req.cookies.hidden_token
        );
        console.log("This is Show Hidden" + showHidden);
        return this.folderService.getFolderChildrens(id, req.user.id, showHidden);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Create new folder for user"
    })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Create folder successfully!" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Drive is not found or it's your own!" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    async createFolder(
        @Body() dto: CreateFolderDTO,
        @Req() req: AuthenticatedRequest
    ) {
        return this.folderService.createFolder(req.user.id, dto.driveId, dto.parentFolderId, dto.folderName)
    }

    @Patch(":id/rename")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Edit folder name"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Rename folder successfully!" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Drive is not found or it's your own!" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    async renameFolder(
        @Param("id") id: string,
        @Body() dto: RenameFolderDTO,
        @Req() req: AuthenticatedRequest
    ) {
        return this.folderService.renameFolder(req.user.id, id, dto.newFolderName);
    }

    @Patch(":id/hidden")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Restore folder"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Hidden folder successfully!" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Folder is not found!" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    async hideFolder(
        @Param("id") id: string,
        @Body() dto: HideFolderDTO,
        @Req() req: AuthenticatedRequest
    ) {
        return this.folderService.hideFolder(req.user.id, id, dto.hashPassword);
    }

    @Patch(":id/show")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Restore folder"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Show folder successfully!" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Folder is not found!" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Password is not set!" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Password is not valid!" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    async showFolder(
        @Param("id") id: string,
        @Body() dto: ShowFolderDTO,
        @Req() req: AuthenticatedRequest
    ) {
        return this.folderService.showFolder(req.user.id, id, dto.comparePassword);
    }

    @Delete(":id/delete")
    @UseGuards(JwtAuthGuard)
    async deleteFolder(
        @Req() req: AuthenticatedRequest,
        @Param("id") folderId: string,
    ) {
        return this.folderService.deleteFolder(req.user.id, folderId);
    }

    @Get("trash")
    @UseGuards(JwtAuthGuard)
    async getTrash(
        @Req() req: AuthenticatedRequest,
    ) {
        return this.folderService.getTrash(req.user.id);
    }

    @Get(":folderId/path")
    @UseGuards(JwtAuthGuard)
    async getFolderPath(
        @Req() req: AuthenticatedRequest,
        @Param("folderId") folderId: string,
    ) {
        return this.folderService.getFolderPath(folderId, req.user.id);
    }

    @Get(":folderId/detail")
    @UseGuards(JwtAuthGuard)
    async getFolderDetail(
        @Param("folderId") folderId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.folderService.getFolderDetail(req.user.id, folderId);
    }

    @Patch(":folderId/restore")
    @UseGuards(JwtAuthGuard)
    async restoreFolder(
        @Param("folderId") folderId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.folderService.restoreFolder(req.user.id, folderId);
    }
}