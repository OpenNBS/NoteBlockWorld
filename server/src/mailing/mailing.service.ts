import { Inject, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailingService {
  private readonly logger = new Logger(MailingService.name);
  constructor(
    @Inject(MailerService)
    private readonly mailerService: MailerService,
  ) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: {
      [name: string]: any;
    },
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: `${template}`, // The template file name (without extension)
        context, // The context to be passed to the template
      });

      this.logger.debug(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      throw error;
    }
  }
}
