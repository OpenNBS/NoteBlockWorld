import { Module } from '@nestjs/common';

import { EmailLoginController } from './email-login.controller';
import { EmailLoginService } from './email-login.service';

@Module({
    controllers: [EmailLoginController],
    providers  : [EmailLoginService]
})
export class EmailLoginModule {}
