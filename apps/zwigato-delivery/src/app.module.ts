import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { DeliveryAgentModule } from './delivery-agent/delivery-agent.module';
import { GeoCoddingService } from './geoCodding.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    MailModule,
    DeliveryAgentModule,
  ],
  controllers: [AppController],
  providers: [AppService, GeoCoddingService],
})
export class AppModule {}
