import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DataSource, ILike } from 'typeorm';
import { Restaurant } from './db/entities/restaurant.entity';
import { QueryForRestoRequestDto } from './dto/request/query.resto.request.dto';

import { GetRestaurantResponseDto } from './dto/response/restaurant.response.dto';

@Injectable()
export class AppService {
  constructor(@Inject('DataSource') private dataSource: DataSource) {}

  async getItems(
    queryRestoReqDto: QueryForRestoRequestDto,
  ): Promise<GetRestaurantResponseDto> {
    const { pincode, search } = queryRestoReqDto;
    try {
      const findBySearch = await this.dataSource.manager.find(Restaurant, {
        where: [
          {
            pincode,
            ...(search && { restaurantName: ILike(`%${search}%`) }),
            isActive: true,
            restaurantMenu: {
              isAvailable: true,
              isDeleted: false,
            },
          },

          {
            isActive: true,
            pincode,
            restaurantMenu: {
              itemName: ILike(`%${search}%`),
              isAvailable: true,
              isDeleted: false,
            },
          },
          {
            isActive: true,
            pincode,
            restaurantMenu: {
              foodCategory: {
                categoryName: ILike(`%${search}%`),
              },
            },
          },
        ],
        relations: ['restaurantMenu', 'restaurantMenu.addOns'],
      });

      if (findBySearch.length > 0) {
        return new GetRestaurantResponseDto(
          false,
          'result fetched',
          findBySearch,
        );
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('no results found');
      }
      throw new BadGatewayException('Unable to get Items');
    }
  }
}
