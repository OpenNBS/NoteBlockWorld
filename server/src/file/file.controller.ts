import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileService } from './file.service';
import multerConfig from './multer-config';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(@UploadedFile() file: Express.MulterS3.File) {
    console.log(file);
    return file.location;
    //return this.fileService.saveFile(file);
  }
}
