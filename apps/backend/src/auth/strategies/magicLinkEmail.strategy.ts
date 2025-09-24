import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import strategy from 'passport-magic-login';

import { MailingService } from '@server/mailing/mailing.service';
import { UserService } from '@server/user/user.service';

type authenticationLinkPayload = {
    destination: string;
};

type magicLinkCallback = (error: any, user: any) => void;

@Injectable()
export class MagicLinkEmailStrategy extends PassportStrategy(
    strategy,
    'magic-link'
) {
    static logger = new Logger(MagicLinkEmailStrategy.name);

    constructor(
        @Inject('MAGIC_LINK_SECRET')
        MAGIC_LINK_SECRET: string,
        @Inject('SERVER_URL')
        SERVER_URL: string,
        @Inject(UserService)
        private readonly userService: UserService,
        @Inject(MailingService)
        private readonly mailingService: MailingService
    ) {
        super({
            secret       : MAGIC_LINK_SECRET,
            confirmUrl   : `${SERVER_URL}/api/v1/auth/magic-link/confirm`,
            callbackUrl  : `${SERVER_URL}/api/v1/auth/magic-link/callback`,
            sendMagicLink: MagicLinkEmailStrategy.sendMagicLink(
                SERVER_URL,
                userService,
                mailingService
            ),
            verify: (
                payload: authenticationLinkPayload,
                callback: magicLinkCallback
            ) => {
                callback(null, this.validate(payload));
            }
        });
    }

    static sendMagicLink =
        (
            SERVER_URL: string,
            userService: UserService,
            mailingService: MailingService
        ) =>
            async (email: string, magicLink: string) => {
                const user = await userService.findByEmail(email);

                if (!user) {
                    mailingService.sendEmail({
                        to     : email,
                        context: {
                            magicLink: magicLink,
                            username : email.split('@')[0]
                        },
                        subject : 'Welcome to Noteblock.world',
                        template: 'magic-link-new-account'
                    });
                } else {
                    mailingService.sendEmail({
                        to     : email,
                        context: {
                            magicLink: magicLink,
                            username : user.username
                        },
                        subject : 'Noteblock Magic Link',
                        template: 'magic-link'
                    });
                }
            };

    async validate(payload: authenticationLinkPayload) {
        MagicLinkEmailStrategy.logger.debug(
            `Validating payload: ${JSON.stringify(payload)}`
        );

        const user = await this.userService.findByEmail(payload.destination);

        if (!user) {
            return await this.userService.createWithEmail(payload.destination);
        }

        MagicLinkEmailStrategy.logger.debug(`User found: ${user.username}`);

        return user;
    }
}
