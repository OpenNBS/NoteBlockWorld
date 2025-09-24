import { Controller } from '@nestjs/common';

import { MailingService } from './mailing.service';

@Controller()
export class MailingController {
    constructor(private readonly mailingService: MailingService) {}
}
