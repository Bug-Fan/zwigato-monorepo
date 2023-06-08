import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:[MailModule],
  providers: [CronjobsService]
})
export class CronjobsModule {

  
}
