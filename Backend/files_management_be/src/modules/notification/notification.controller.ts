import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request.interface";

@Controller("notification")
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getNotifications(@Req() req: AuthenticatedRequest) {
        return this.notificationService.getNotifications(req.user.id);
    }
}