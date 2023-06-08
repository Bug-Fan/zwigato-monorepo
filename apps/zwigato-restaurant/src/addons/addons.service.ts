import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RestaurantMenuAddOns } from 'src/database/entities/restaurantMenuAddOns.entity';
import { EntityManager, DataSource, ILike, UpdateResult } from 'typeorm';
import { AddAddonDto } from './dto/request/addaddOn.dto';
import { DeleteParamAddOns } from './dto/request/deleteAddonParam.dto';
import { GetAddonDto } from './dto/request/getAddOn.dto';
import { UpdateAddOns } from './dto/request/updateAddon.dto';
import { UpdateAddonParamsDTO } from './dto/request/updateAddonParam.dto';
import { AddonList } from './dto/response/getAddOnResponse.dto';
import { RestaurantMenu } from 'src/database/entities/restaurantMenu.entity';
import { UpdateAvaililibilyBodyDTO } from './dto/request/updateAvaililibilyBody.request.dto';
import { UpdateAvaililibilyParamDTO } from './dto/request/updateAvailibilityParams.request.dto';
import { Restaurant } from 'src/database/entities/restaurant.entity';
import { CommonResDto } from 'src/dto/commonResponse.dto';

@Injectable()
export class AddonsService {
  private manager: EntityManager;
  constructor(@Inject('DataSource') datasource: DataSource) {
    this.manager = datasource.manager;
  }
  async addAddOn(
    addOnDto: AddAddonDto,
    restaurantId: string,
  ): Promise<CommonResDto> {
    try {
      const findItem = await this.manager.findOne(RestaurantMenu, {
        where: { itemId: addOnDto.menuItemId, isDeleted: false, restaurantId },
      });
      if (findItem) {
        const addOnEntity = this.manager.create(RestaurantMenuAddOns, addOnDto);
        await this.manager.save(addOnEntity);
        return new CommonResDto(false, 'Addons Added For Your Item');
      } else {
        throw new BadRequestException('Menu item is not exist');
      }
    } catch (error) {
      if (error.code && error.code == 23503)
        throw new BadRequestException('MenuItem Not Found');
      else if (error.code && error.code == 23505)
        throw new BadRequestException(
          'Addon already exists for given menu item',
        );
      else throw new BadRequestException(error.message);
    }
  }

  async updateAddons(
    restaurantId: string,
    updateAddonParamsDTO: UpdateAddonParamsDTO,
    updateAddOns: UpdateAddOns,
  ): Promise<CommonResDto> {
    let updateMenuItem;
    try {
      let isItemOwnedByRestaurant = await this.manager.findOne(RestaurantMenu, {
        where: {
          restaurantId,
          addOns: { menuAddOnId: updateAddonParamsDTO.menuAddOnId },
        },
        relations: ['addOns'],
      });

      

      if (isItemOwnedByRestaurant) {
        updateMenuItem = await this.manager.update(
          RestaurantMenuAddOns,
          {
            menuAddOnId: updateAddonParamsDTO.menuAddOnId,
            isDeleted: false,
          },
          updateAddOns,
        );
      }
    } catch (e) {
      // throw new BadRequestException(e.message);
    }
    if (updateMenuItem.affected > 0)
      return new CommonResDto(false, 'Addons updated');
    else throw new BadRequestException('Addons not found');
  }

  async deleteAddon(
    restaurantId: string,
    deleteAddOn: DeleteParamAddOns,
  ): Promise<CommonResDto> {
    let deleteResult;

    try {
      let isItemOwnedByRestaurant = await this.manager.findOne(RestaurantMenu, {
        where: {
          restaurantId,
          addOns: { menuAddOnId: deleteAddOn.menuAddOnId },
        },
        relations: ['addOns'],
      });
      if (isItemOwnedByRestaurant) {
        deleteResult = await this.manager.update(
          RestaurantMenuAddOns,
          {
            menuAddOnId: deleteAddOn.menuAddOnId,
            isDeleted: false,
          },
          { isDeleted: true, isAvailable: false },
        );
        this.manager.softDelete(RestaurantMenuAddOns, {
          menuAddOnId: deleteAddOn.menuAddOnId,
        });
      }
    } catch (e) {
      // throw new BadRequestException(e);
    }
    if (deleteResult)
      return new CommonResDto(false, 'Addons deleted successfuly');
    else throw new BadRequestException('Addon not found');
  }

  async getAddons(
    restaurantId: string,
    getAddonDto: GetAddonDto,
  ): Promise<AddonList> {
    let addonsItem;
    try {
      addonsItem = await this.manager.find(RestaurantMenuAddOns, {
        where: {
          addOnName: ILike(`%${getAddonDto.query}%`),
          menu: { restaurantId },
        },
      });
    } catch (e) {
      // throw new BadRequestException(
      //   'Unable to get Items try again after sometime',
      // );
    }

    if (addonsItem.length > 0)
      return new AddonList(false, 'List Of Addons', addonsItem);
    else throw new NotFoundException('Menu items not found');
  }

  async updateAddOnAvailibility(
    restaurantId: string,
    updateAvailabilityParamDTO: UpdateAvaililibilyParamDTO,
    updateAvailabilityBodyDTO: UpdateAvaililibilyBodyDTO,
  ) {
    let updateAvailibilityResult: UpdateResult;
    try {
      const data = await this.manager.find(Restaurant, {
        relations: { restaurantMenu: { addOns: true } },
        where: {
          restaurantId,
          restaurantMenu: {
            addOns: { menuAddOnId: updateAvailabilityParamDTO.menuAddOnId },
          },
        },
      });
      if (data.length > 0) {
        updateAvailibilityResult = await this.manager.update(
          RestaurantMenuAddOns,
          {
            menuAddOnId: updateAvailabilityParamDTO.menuAddOnId,
            isDeleted: false,
          },
          { isAvailable: updateAvailabilityBodyDTO.isAvailable },
        );

        return new CommonResDto(false, 'AddOn availibility updated');
      } else {
        throw new BadRequestException('AddOn Item Not Found...');
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
