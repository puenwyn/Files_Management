import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { FileService } from "./file.service";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request.interface";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateFileUploadDTO } from "./dtos/create-file-upload.dto";
import { CompleteFileUploadDTO } from "./dtos/complete-file-upload.dto";

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
}