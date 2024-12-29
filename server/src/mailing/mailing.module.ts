import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { MailingController } from './mailing.controller';

@Module({
  controllers: [MailingController],
  providers: [MailingService],
})
export class MailingModule {}
