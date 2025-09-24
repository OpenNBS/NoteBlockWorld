import { Module } from '@nestjs/common';

import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';

@Module({
  controllers: [MailingController],
  providers  : [MailingService],
  exports    : [MailingService]
})
export class MailingModule {}
