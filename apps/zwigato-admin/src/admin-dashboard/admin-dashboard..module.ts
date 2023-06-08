import { Module } from '@nestjs/common';
import { AdminService } from './admin-dashboard..service';
import { AdminController } from './admin-dashboard.controller';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule { }
