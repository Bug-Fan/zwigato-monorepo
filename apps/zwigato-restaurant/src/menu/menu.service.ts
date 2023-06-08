import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, UpdateResult, ILike } from 'typeorm';
import { RestaurantMenu } from 'src/database/entities/restaurantMenu.entity';
import { AddMenuItemDto } from './dto/request/addMenuItem.request.dto';
import { GetMenuItemsResponse } from './dto/response/getMenuItems.response.dto';
import { DeleteMenuItemRequestDTO } from './dto/request/deleteMenuItem.request.dto';
import { RestaurantMenuAddOns } from 'src/database/entities/restaurantMenuAddOns.entity';
import { UpdateAvaililibilyBodyDTO } from './dto/request/updateAvaililibilyBody.request.dto';
import { UpdateMenuItemRequestDTO } from './dto/request/updateMenuItem.request.dto';
import { UpdateAvaililibilyParamDTO } from './dto/request/updateAvailibilityParams.request.dto';
import { UpdateMenuItemParamsDTO } from './dto/request/updateMenuItemParams.request.dto';
import { Restaurant } from 'src/database/entities/restaurant.entity';
import { FoodCategory } from 'src/database/entities/foodCategory.entity';
import { CommonResDto } from 'src/dto/commonResponse.dto';
import { FoodCatesResponse } from './dto/response/foodCate.response.dto';

@Injectable()
export class MenuService {
  private entityManager: EntityManager;
  constructor(@Inject('DataSource') dataSource: DataSource) {
    this.entityManager = dataSource.manager;
  }

  async getMenuItems(
    restaurantId: string,
    menuName: string,
  ): Promise<GetMenuItemsResponse> {
    let menuItems: RestaurantMenu[];
    try {
      menuItems = await this.entityManager.find(RestaurantMenu, {
        where: {
          restaurantId,
          isDeleted: false,
          ...(menuName && { itemName: ILike(`%${menuName}%`) }),
        },
        relations: ['foodCategory'],
      });

      let menuItemswithAddOns = await Promise.all(
        menuItems.map(async (menuItem) => {
          const addons = await this.entityManager.find(RestaurantMenuAddOns, {
            where: {
              menuItemId: menuItem.itemId,
              isDeleted: false,
            },
          });
         
          menuItem.addOns = addons;
          return menuItem;
        }),
      );
    } catch (e) {
      throw new BadRequestException(
        'Unable to get Items try again after sometime',
      );
    }
    if (menuItems.length > 0)
      return new GetMenuItemsResponse(false, 'List Of Menu', menuItems);
    else throw new NotFoundException('Menu items not found');
  }

  async addMenuItem(
    menuItemDto: AddMenuItemDto,
    restaurantId: string,
    path: string,
  ): Promise<CommonResDto> {
    const menuEntity = this.entityManager.create(RestaurantMenu, {
      ...menuItemDto,
      restaurantId,
      itemImagePath: path,
    });

    try {
      await this.entityManager.save(menuEntity);
      return new CommonResDto(
        false,
        'Menu item added now you can add addons of an item',
      );
    } catch (error) {
      if (error.code && error.code == 23503)
        throw new BadRequestException('Food category not found');
      else if (error.code && error.code == 23505)
        throw new BadRequestException('Menu item already exists');
      else
        throw new BadRequestException(
          'Unable add menu item try again after some time.',
        );
    }
  }

  async updateMenuItem(
    filePath,
    updateMenuDTO: UpdateMenuItemRequestDTO,
    updateMenuItemParams: UpdateMenuItemParamsDTO,
    restaurantId: string,
  ): Promise<CommonResDto> {
    let updateMenuItem: UpdateResult;
    try {
      updateMenuItem = await this.entityManager.update(
        RestaurantMenu,
        { itemId: updateMenuItemParams.itemId, isDeleted: false, restaurantId },
        { ...updateMenuDTO, itemImagePath: filePath },
      );
    } catch (e) {
      throw new BadRequestException('Unable to update menuItem');
    }
    if (updateMenuItem.affected > 0)
      return new CommonResDto(false, 'Menu item updated');
    else throw new BadRequestException('Product not found');
  }

  async deleteMenuItem(
    restaurantId: string,
    deleleMenuDto: DeleteMenuItemRequestDTO,
  ): Promise<CommonResDto> {
    let deleteResult: boolean;
    try {
      deleteResult = await this.entityManager.transaction(
        async (em): Promise<boolean> => {
          const deleteResultMenuItem = await em.update(
            RestaurantMenu,
            { itemId: deleleMenuDto.itemId, isDeleted: false, restaurantId },
            { isDeleted: true, isAvailable: false },
          );
          if (deleteResultMenuItem.affected > 0) {
            await em.softDelete(RestaurantMenu, {
              itemId: deleleMenuDto.itemId,
            });
            await em.update(
              RestaurantMenuAddOns,
              { menuItemId: deleleMenuDto.itemId },
              { isDeleted: true, isAvailable: false },
            );
            return true;
          } else return false;
        },
      );
    } catch (e) {
      throw new BadRequestException(
        'Unable to delete item try again after some time',
      );
    }
    if (deleteResult)
      return new CommonResDto(
        false,
        'Menu item and related Addons deleted successfuly',
      );
    else throw new BadRequestException('Menu item not found');
  }

  async updateProductAvailibility(
    restaurantId: string,
    updateAvailabilityParamDTO: UpdateAvaililibilyParamDTO,
    updateAvailabilityBodyDTO: UpdateAvaililibilyBodyDTO,
  ): Promise<CommonResDto> {
    let updateAvailibilityResult: UpdateResult;
    try {
      const data = await this.entityManager.find(Restaurant, {
        relations: { restaurantMenu: { addOns: true } },
        where: {
          restaurantId,
          restaurantMenu: {
            itemId: updateAvailabilityParamDTO.itemId,
            isDeleted: false,
          },
        },
      });
      if (data.length > 0) {
        updateAvailibilityResult = await this.entityManager.update(
          RestaurantMenu,
          { itemId: updateAvailabilityParamDTO.itemId },
          { isAvailable: updateAvailabilityBodyDTO.isAvailable },
        );
      }
    } catch (e) {
      throw new BadRequestException(
        'Unable to change status please try again after sometime',
      );
    }

    if (updateAvailibilityResult && updateAvailibilityResult.affected > 0)
      return new CommonResDto(false, 'Product availibility updated');
    else throw new BadRequestException('Product not found');
  }

  async getFoodCategoryTypes() {
    try {
      const result = await this.entityManager.find(FoodCategory);
      return new FoodCatesResponse(false, 'Food categories retrived', result);
    } catch (e) {
      return new CommonResDto(true, 'Error in retriving data');
    }
  }
}
