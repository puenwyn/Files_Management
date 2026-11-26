import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from 'src/infrastructure/storage/storage.service';
import { DriveService } from '../drive/drive.service';
import { FolderService } from '../folder/folder.service';
import { ACLService } from '../acl/acl.service';
import { ActivityAction, NotificationType, PermissionType, Prisma, ResourceType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompleteFileUploadDTO } from './dtos/complete-file-upload.dto';
import { CreateFileUploadDTO } from './dtos/create-file-upload.dto';
import { FileDetailResponseDTO } from './dtos/file-detail-response.dto';
import { FileResponseDTO } from './dtos/file-response.dto';
import { ActivityService } from '../activity/activity.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class FileService {

}
