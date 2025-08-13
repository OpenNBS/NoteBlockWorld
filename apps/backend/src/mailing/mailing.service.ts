import { Inject, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: {
    [name: string]: any;
  };
}

@Injectable()
export class MailingService {
  private readonly logger = new Logger(MailingService.name);
  constructor(
    @Inject(MailerService)
    private readonly mailerService: MailerService,
  ) {}

  async sendEmail({
    to,
    subject,
    template,
    context,
  }: EmailOptions): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: `${template}`, // The template file name (without extension)
        context, // The context to be passed to the template
        attachments: [
          {
            filename: 'background-image.png',
            cid: 'background-image',
            path: `${__dirname}/templates/img/background-image.png`,
          },
          {
            filename: 'logo.png',
            cid: 'logo',
            path: `${__dirname}/templates/img/logo.png`,
          },
        ],
      });

      this.logger.debug(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      throw error;
    }
  }
}
