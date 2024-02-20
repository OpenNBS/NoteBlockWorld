/*
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Request } from 'express';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fotoRepository: Repository<File>,
  ) {}

  async saveFile(file: Express.MulterS3.File) {
    const arquivo = new File();
    arquivo.fileName = file.key;
    arquivo.contentLength = file.size;
    arquivo.contentType = file.mimetype;
    arquivo.url = file.location;

    return await this.fotoRepository.save(arquivo);
  }
}
*/

export class FileService {
  constructor() {}
}
