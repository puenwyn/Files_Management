import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { StorageModule } from 'src/infrastructure/storage/storage.module';
import { DriveModule } from '../drive/drive.module';
import { FolderModule } from '../folder/folder.module';
import { ACLModule } from '../acl/acl.module';
import { ActivityModule } from '../activity/activity.module';
import { NotificationModule } from '../notification/notification.module';
import { FileUploadService } from './services/file-upload.service';
import { FileQueryService } from './services/fire-query.service';
import { FileMutationService } from './services/fire-mutation.service';

@Module({
  imports: [StorageModule, DriveModule, FolderModule, ACLModule, ActivityModule, NotificationModule],
  controllers: [FileController],
  providers: [FileService, FileUploadService, FileQueryService, FileMutationService],
  exports: [FileService]
})
export class FileModule { }
