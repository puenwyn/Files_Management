import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { FileService } from "./file.service";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request.interface";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateFileUploadDTO } from "./dtos/create-file-upload.dto";
import { CompleteFileUploadDTO } from "./dtos/complete-file-upload.dto";
import { RenameFileDTO } from "./dtos/rename-file.dto";

@Controller("file")
export class FileController {
    constructor(private readonly fileService: FileService) { }

    @Post("upload")
    @UseGuards(JwtAuthGuard)
    async createUpload(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CreateFileUploadDTO,
    ) {
        return this.fileService.createUpload(req.user.id, dto);
    }

    @Post("complete-upload")
    @UseGuards(JwtAuthGuard)
    async completeUpload(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CompleteFileUploadDTO,
    ) {
        return this.fileService.completeUpload(req.user.id, dto);
    }

    @Get("drive/:id")
    @UseGuards(JwtAuthGuard)
    async getDriveFiles(
        @Param("id") driveId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.fileService.getDriveFiles(req.user.id, driveId);
    }

    // Get files inside a folder
    @Get("folder/:folderId")
    @UseGuards(JwtAuthGuard)
    async getFolderFiles(
        @Param("folderId") folderId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.fileService.getFolderFiles(req.user.id, folderId);
    }

    @Get("trash")
    @UseGuards(JwtAuthGuard)
    getTrash(@Req() req: AuthenticatedRequest) {
        return this.fileService.getTrash(req.user.id);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    async getFileDetail(
        @Param("id") fileId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.fileService.getFileDetail(req.user.id, fileId);
    }

    @Get(":id/preview")
    @UseGuards(JwtAuthGuard)
    async getFilePreview(
        @Param("id") fileId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.fileService.getFilePreview(
            req.user.id,
            fileId,
        );
    }

    @Patch(":fileId/rename")
    @UseGuards(JwtAuthGuard)
    renameFile(
        @Req() req: AuthenticatedRequest,
        @Param("fileId") fileId: string,
        @Body() dto: RenameFileDTO,
    ) {
        return this.fileService.renameFile(req.user.id, fileId, dto.newName);
    }

    @Delete(":fileId/delete")
    @UseGuards(JwtAuthGuard)
    deleteFile(
        @Req() req: AuthenticatedRequest,
        @Param("fileId") fileId: string,
    ) {
        return this.fileService.deleteFile(req.user.id, fileId);
    }

    @Patch(":fileId/restore")
    @UseGuards(JwtAuthGuard)
    restoreFile(
        @Req() req: AuthenticatedRequest,
        @Param("fileId") fileId: string,
    ) {
        return this.fileService.restoreFile(req.user.id, fileId);
    }
}