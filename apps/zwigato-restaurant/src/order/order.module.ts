import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { GeoCoddingService } from './geoCodding.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, GeoCoddingService],
})
export class OrderModule {}
