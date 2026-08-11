import { Body, Controller, Param, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { DriveService } from "./drive.service";
import { RenameDriveDTO } from "./dtos/rename-drive.dto";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request.interface";
import { ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("drive")
export class DriveController {
    constructor(private readonly drive: DriveService) { }

    // @Post()
    // @UseGuards(JwtAuthGuard)
    // @ApiOperation({
    //     summary: "Add new drive"
    // })
    // async addDrive() {

    // }

    @Patch(":id/rename")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Rename user drive"
    })
    async renameDrive(
        @Param("id") id: string,
        @Body() dto: RenameDriveDTO,
        @Req() req: AuthenticatedRequest
    ) {
        return this.drive.renameDrive(id, req.user.id, dto.newDriveName);
    }
}