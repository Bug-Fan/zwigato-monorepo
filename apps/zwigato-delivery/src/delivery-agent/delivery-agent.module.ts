import { Module } from '@nestjs/common';
import { DeliveryAgentService } from './delivery-agent.service';
import { DeliveryAgentController } from './delivery-agent.controller';
import { MailModule } from 'src/mail/mail.module';
import { MulterModule } from '@nestjs/platform-express';
import { GeoCoddingService } from 'src/geoCodding.service';

@Module({
  imports: [
    MailModule,
    MulterModule.register({
      dest: './upload',
      // limits: { fileSize: 1024 * 1024 * 12 },
    }),
  ],
  providers: [DeliveryAgentService, GeoCoddingService],
  controllers: [DeliveryAgentController],
})
export class DeliveryAgentModule {}
