import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configservice: ConfigService,
      ): Promise<MailerOptions> => {
        return {
          transport: {
            host: configservice.get<string>('EMAIL_HOST'),
            auth: {
              user: configservice.get<string>('SENDING_USER'),
              pass: configservice.get<string>('SENDING_PASS'),
            },
            secure: true,
          },

          template: {
            dir: join(__dirname, '/email/mailTemplates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],

  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
