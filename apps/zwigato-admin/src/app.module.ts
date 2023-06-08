import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin-dashboard/admin-dashboard..module';
import { CouponModule } from './coupon/coupon.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './notifications/notifications.module';
import { CronjobsModule } from './cronjobs/cronjobs.module';
import { ManagerModule } from './manager-dashboard/manager-dashboard.module';


@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    MailModule,
    AdminModule,
    CouponModule,
    NotificationsModule,
    CronjobsModule,
    ManagerModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
