import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { StorageModule } from 'src/infrastructure/storage/storage.module';
import { DriveModule } from '../drive/drive.module';
import { FolderModule } from '../folder/folder.module';
import { ACLModule } from '../acl/acl.module';

@Module({
  imports: [StorageModule, DriveModule, FolderModule, ACLModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule { }
