import { Controller } from '@nestjs/common';

import { EmailLoginService } from './email-login.service';

@Controller('email-login')
export class EmailLoginController {
    constructor(private readonly emailLoginService: EmailLoginService) {}
}
