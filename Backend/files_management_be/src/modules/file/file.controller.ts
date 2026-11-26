import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request.interface";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateFileUploadDTO } from "./dtos/create-file-upload.dto";
import { CompleteFileUploadDTO } from "./dtos/complete-file-upload.dto";
import { RenameFileDTO } from "./dtos/rename-file.dto";
import { FileUploadService } from "./services/file-upload.service";
import { FileQueryService } from "./services/fire-query.service";
import { FileMutationService } from "./services/fire-mutation.service";

@Controller("file")
export class FileController {
    constructor(
        private readonly fileUploadService: FileUploadService,
        private readonly fileQueryService: FileQueryService,
        private readonly fileMutationService: FileMutationService,
    ) { }

    @Post("upload")
    @UseGuards(JwtAuthGuard)
    async createUpload(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CreateFileUploadDTO,
    ) {
        return this.fileUploadService.createUpload(req.user.id, dto);
    }

    @Post("complete-upload")
    @UseGuards(JwtAuthGuard)
    async completeUpload(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CompleteFileUploadDTO,
    ) {
        return this.fileUploadService.completeUpload(req.user.id, dto);
    }

    @Get("drive/:id")
    @UseGuards(JwtAuthGuard)
    async getDriveFiles(
        @Param("id") driveId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.fileQueryService.getDriveFiles(req.user.id, driveId);
    }

    @Get("folder/:folderId")
    @UseGuards(JwtAuthGuard)
    async getFolderFiles(
        @Param("folderId") folderId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.fileQueryService.getFolderFiles(req.user.id, folderId);
    }

    @Get("trash")
    @UseGuards(JwtAuthGuard)
    getTrash(@Req() req: AuthenticatedRequest) {
        return this.fileQueryService.getTrash(req.user.id);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    async getFileDetail(
        @Param("id") fileId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.fileQueryService.getFileDetail(req.user.id, fileId);
    }

    @Get(":id/preview")
    @UseGuards(JwtAuthGuard)
    async getFilePreview(
        @Param("id") fileId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.fileQueryService.getFilePreview(req.user.id, fileId);
    }

    @Patch(":fileId/rename")
    @UseGuards(JwtAuthGuard)
    renameFile(
        @Req() req: AuthenticatedRequest,
        @Param("fileId") fileId: string,
        @Body() dto: RenameFileDTO,
    ) {
        return this.fileMutationService.renameFile(req.user.id, fileId, dto.newName);
    }

    @Delete(":fileId/delete")
    @UseGuards(JwtAuthGuard)
    deleteFile(
        @Req() req: AuthenticatedRequest,
        @Param("fileId") fileId: string,
    ) {
        return this.fileMutationService.deleteFile(req.user.id, fileId);
    }

    @Patch(":fileId/restore")
    @UseGuards(JwtAuthGuard)
    restoreFile(
        @Req() req: AuthenticatedRequest,
        @Param("fileId") fileId: string,
    ) {
        return this.fileMutationService.restoreFile(req.user.id, fileId);
    }
}