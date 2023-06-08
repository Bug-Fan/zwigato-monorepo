import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { Order, OrderStatus } from 'src/db/entities/order.entity';
import { Restaurant } from 'src/db/entities/restaurant.entity';
import { DataSource, EntityManager, ILike } from 'typeorm';
import { GetResByFilterRequestDto } from './dto/request/getresbyfilterreq.dto';
import { GetOrderResponseDto } from './dto/response/getorders.response.dto';
import { GetRestaurantResponseDto } from './dto/response/getrestaurant.response.dto';

export class ManagerService {
  private manager: EntityManager;
  constructor(@Inject('DataSource') private dataSource: DataSource) {
    this.manager = this.dataSource.manager;
  }

  async getRestaurant(
    queryData: GetResByFilterRequestDto,
    page,
    limit,
  ): Promise<GetRestaurantResponseDto> {
    const take = limit || 3;
    const skip = (page - 1) * limit;
    try {
      const restaurantData = await this.manager.findAndCount(Restaurant, {
        where: {
          ...(queryData.restaurantName && {
            restaurantName: ILike(`%${queryData.restaurantName}%`),
          }),
          city: queryData.city,
          isActive: queryData.isActive,
          isVerified: queryData.isVerified,
        },
        take,
        skip,
        relations: ['restaurantType'],
      });

      if (!restaurantData) {
        throw new NotFoundException('Data is not found');
      } else {
        return new GetRestaurantResponseDto(
          true,
          'Data Fetched Successfully',
          restaurantData,
        );
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getAllOrders(queryData): Promise<GetOrderResponseDto> {
    try {
      const orderData = await this.manager.findAndCount(Order, {
        where: {
          ...(queryData.OrderStatus && {
            restaurantName: ILike(`%${queryData.OrderStatus}%`),
          }),

          orderStatus: queryData.orderStatus,
        },
        relations: ['orderBroadcast'],
      });

      if (!orderData) {
        throw new NotFoundException('Data is not found');
      } else {
        return new GetOrderResponseDto(
          true,
          'Data Fetched Successfully',
          orderData,
        );
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
