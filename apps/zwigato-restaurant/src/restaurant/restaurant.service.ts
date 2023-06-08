import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RestaurantUpdateDto } from './dto/request/restaurantUpdateDetails.request.dto';
import { EntityManager, DataSource, UpdateResult } from 'typeorm';
import { Restaurant } from 'src/database/entities/restaurant.entity';
import { UpdateBankDetailsRequest } from './dto/request/restaurantUpdateBank.request.dto';
import { UpdateRestaurantAvailibilityDTO } from './dto/request/updateRestaurantAvailability.request.dto';
import { Order, OrderStatus } from 'src/database/entities/order.entity';
import { RestaurantProfileRes } from './dto/response/restaurantData.res.dto';
import { EarningRequestDTO } from './dto/request/earning.request.dto';
import { CommonResDto } from 'src/dto/commonResponse.dto';
import { EarningRes, EarningResDTO } from './dto/response/earning.res.dto';

@Injectable()
export class RestaurantService {
  private entityManager: EntityManager;
  constructor(@Inject('DataSource') dataSource: DataSource) {
    this.entityManager = dataSource.manager;
  }

  async updateRestuarentDetails(
    restaurantDetails: RestaurantUpdateDto,
    logoPath: string,
    restaurantId: string,
  ) {
    let updateResult: UpdateResult;
    try {
      updateResult = await this.entityManager.update(
        Restaurant,
        { restaurantId, isDeleted: false },
        { ...restaurantDetails, logoPath },
      );
    } catch (e) {
      throw new BadRequestException('Unable to update the details');
    }

    if (updateResult.affected > 0) {
      return new CommonResDto(false, 'Data is updated succesfully');
    } else {
      return new CommonResDto(true, 'Restaurant not found');
    }
  }

  async updateBankDetails(
    bankDetails: UpdateBankDetailsRequest,
    passBookImagePath: string,
    restaurantId: string,
  ) {
    let updateResult: UpdateResult;
    try {
      updateResult = await this.entityManager.update(
        Restaurant,
        { restaurantId, isDeleted: false },
        { ...bankDetails, passBookImagePath },
      );
    } catch (e) {
      throw new BadRequestException('Unable to update the details');
    }

    if (updateResult.affected > 0) {
      return new CommonResDto(false, 'Data is updated succesfully');
    } else {
      return new CommonResDto(true, 'Restaurant not found');
    }
  }

  async updateAvailibility(
    restaurantId: string,
    availibilityDTO: UpdateRestaurantAvailibilityDTO,
  ): Promise<CommonResDto> {
    let updateAvailibilityResult: UpdateResult;
    try {
      updateAvailibilityResult = await this.entityManager.update(
        Restaurant,
        { restaurantId, isDeleted: false },
        { isActive: availibilityDTO.isAvailable },
      );
    } catch (e) {
      throw new BadRequestException(
        'Unable to change status please try again after sometime',
      );
    }

    if (updateAvailibilityResult.affected > 0)
      return new CommonResDto(false, 'Visiblility changed');
    else return new CommonResDto(true, 'User not found');
  }

  async getEarnings(earningReqDTO: EarningRequestDTO, restaurantId: string) {
    try {
      const start = new Date(earningReqDTO.start);
      const end = new Date(earningReqDTO.end);

      const result = await this.entityManager
        .createQueryBuilder()
        .select(
          'count(order.orderId) Totalorders,Sum(order.resaturantProfit) Totalprofit',
        )
        .from(Order, 'order')
        .where('order.restaurantId = :id', { id: restaurantId })
        .andWhere(
          'CAST(order.orderPlacedOn AS DATE) >= CAST (:start AS DATE) AND CAST(order.orderPlacedOn AS DATE) <= CAST (:end AS DATE)',
          {
            start,
            end,
          },
        )
        .andWhere('order.orderStatus = :status', {
          status: OrderStatus.DELIVERED,
        })
        .execute();
      return new EarningResDTO(
        false,
        'Earning data loaded',
        new EarningRes(
          start.toISOString(),
          end.toISOString(),
          result[0].totalprofit,
          result[0].totalorders,
        ),
      );
    } catch (e) {
      throw new BadRequestException('unable to retrive earning. Please try again later');
    }
  }

  async getRestaurantProfile(
    restaurantId: string,
  ): Promise<RestaurantProfileRes> {
    try {
      const data = await this.entityManager.findOne(Restaurant, {
        where: { restaurantId },
      });
      if (data) {
        return new RestaurantProfileRes(false, 'Data Of Restaurant', data);
      } else {
        throw new BadRequestException(
          'Unable To Load Your Data.Please Try Again..',
        );
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
