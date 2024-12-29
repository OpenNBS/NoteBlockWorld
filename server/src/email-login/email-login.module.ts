import { Module } from '@nestjs/common';
import { EmailLoginService } from './email-login.service';
import { EmailLoginController } from './email-login.controller';

@Module({
  controllers: [EmailLoginController],
  providers: [EmailLoginService],
})
export class EmailLoginModule {}
