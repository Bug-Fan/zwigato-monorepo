import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CartService } from './cart.service';
import { GeoCoddingService } from 'src/geocode.service';

@Module({
  controllers: [OrdersController],
  providers: [CartService, OrdersService, GeoCoddingService],
})
export class OrdersModule {}
