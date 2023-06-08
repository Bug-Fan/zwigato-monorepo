import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:[MailModule],
  providers: [NotificationsService],
})
export class NotificationsModule {}
