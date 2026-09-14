import { Controller, Get, Param } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller("activity")
export class ActivityController {
    constructor(private readonly activityService: ActivityService) { }

    @Get("folder/:id")
    getFolderActivities(
        @Param("id") folderId: string,
    ) {
        return this.activityService.getFolderActivities(folderId);
    }
}
