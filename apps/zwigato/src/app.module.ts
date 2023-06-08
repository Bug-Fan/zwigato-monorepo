import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { EmailModule } from './email/email.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { OrdersModule } from './orders/orders.module';
import { GeoCoddingService } from './geocode.service';
import { cwd } from 'process';

@Module({
  imports: [
    DbModule,
    ConfigModule.forRoot({ isGlobal: true, }),
    EmailModule,
    AuthModule,
    CustomerModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR, 
      useClass: LoggingInterceptor,
    },
    GeoCoddingService,
  ],
})
export class AppModule {}
