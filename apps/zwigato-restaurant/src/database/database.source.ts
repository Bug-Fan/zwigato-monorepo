import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Address } from './entities/address.entitiy';
import { Admin } from './entities/admin.entity';
import { Cart } from './entities/cart.entity';
import { CartAddons } from './entities/cartAddons.entity';
import { Customer } from './entities/customer.entity';
import { DeliveryAgent } from './entities/deliveryAgent.entity';
import { FoodCategory } from './entities/foodCategory.entity';
import { Log } from './entities/log.entity';
import { Order } from './entities/order.entity';
import { OrderAddOns } from './entities/orderAddOns.entity';
import { OrderItems } from './entities/orderItems.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantMenu } from './entities/restaurantMenu.entity';
import { RestaurantMenuAddOns } from './entities/restaurantMenuAddOns.entity';
import { RestaurantType } from './entities/restaurantType.entity';
import { OrderBroadcast } from './entities/orderBroadcast.entity';
import { Manager } from './entities/manager.entity';
import { CouponCategory } from './entities/couponCategory.entity';
import { Coupon } from './entities/coupon.entity';
import { UsedCoupons } from './entities/usedCoupons.entity';

export const DbConnection = [
  {
    provide: 'DataSource',
    useFactory: async (configService: ConfigService) => {
      const datasource = new DataSource({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: true,
        entities: [
          Address,
          Admin,
          Cart,
          CartAddons,
          Customer,
          DeliveryAgent,
          FoodCategory,
          Order,
          OrderAddOns,
          OrderItems,
          Restaurant,
          RestaurantMenu,
          RestaurantMenuAddOns,
          RestaurantType,
          Log,
          OrderBroadcast,
          Manager,
          CouponCategory,
          Coupon,
          UsedCoupons
        ],
        logging: true,
      });
      return await datasource.initialize();
    },
    inject: [ConfigService],
  },
];
