import { Body, Controller, Get, Param, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { DriveService } from "./drive.service";
import { RenameDriveDTO } from "./dtos/rename-drive.dto";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request.interface";
import { ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("drive")
export class DriveController {
    constructor(private readonly driveService: DriveService) { }

    // @Post()
    // @UseGuards(JwtAuthGuard)
    // @ApiOperation({
    //     summary: "Add new drive"
    // })
    // async addDrive() {

    // }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Get all user drives"
    })
    async getDrives(
        @Req() req: AuthenticatedRequest
    ) {
        return this.driveService.getDrives(req.user.id);
    }

    @Get("storage")
    @UseGuards(JwtAuthGuard)
    async getTotalStorage(
        @Req() req: AuthenticatedRequest
    ) {
        return this.driveService.getTotalStorage(req.user.id);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Get drive by id"
    })
    async findDriveById(
        @Req() req: AuthenticatedRequest,
        @Param("id") id: string
    ) {
        return this.driveService.findDriveById(id, req.user.id);
    }

    @Patch(":id/rename")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Rename user drive"
    })
    async renameDrive(
        @Param("id") id: string,
        @Req() req: AuthenticatedRequest,
        @Body() dto: RenameDriveDTO,
    ) {
        return this.driveService.renameDrive(id, req.user.id, dto.newDriveName);
    }
}