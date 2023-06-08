import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { OrderStatus } from 'src/database/entities/order.entity';
import { CommonResDto } from 'src/dto/commonResponse.dto';
import { MenuService } from './menu.service';
import { AddMenuItemDto } from './dto/request/addMenuItem.request.dto';
import {
  FoodType,
  RestaurantMenu,
} from 'src/database/entities/restaurantMenu.entity';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { DeleteMenuItemRequestDTO } from './dto/request/deleteMenuItem.request.dto';
import { UpdateAddonParamsDTO } from 'src/addons/dto/request/updateAddonParam.dto';
import { UpdateAvaililibilyParamDTO } from './dto/request/updateAvailibilityParams.request.dto';
import { UpdateAvaililibilyBodyDTO } from './dto/request/updateAvaililibilyBody.request.dto';
import { UpdateMenuItemRequestDTO } from './dto/request/updateMenuItem.request.dto';
import { UpdateMenuItemParamsDTO } from './dto/request/updateMenuItemParams.request.dto';
import { NotFoundError } from 'rxjs';
import { GetMenuItemsResponse } from './dto/response/getMenuItems.response.dto';
import { FoodCatesResponse } from './dto/response/foodCate.response.dto';
import { FoodCategory } from 'src/database/entities/foodCategory.entity';

describe('menu service', () => {
  let menuService: MenuService;
  let dataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: 'DataSource',
          useValue: {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            release: jest.fn(),
            rollbackTransaction: jest.fn(),
            manager: {
              save: jest.fn(),
              findOne: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              find: jest.fn(),
              transaction: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    dataSource = module.get<DataSource>('DataSource');
    menuService = module.get<MenuService>(MenuService);
  });

  describe('Add menuitem', () => {
    it('Should add Menu item', async () => {
      let addMenuDTO: AddMenuItemDto = plainToInstance(AddMenuItemDto, {
        foodCategoryId: 1,
        foodType: FoodType.VEG,
        itemName: 'Heavy item',
        itemDescription: 'Bhare ITEM',
        MRP: 10.5,
      });

      dataSource.manager.create.mockResolvedValue(addMenuDTO);
      dataSource.manager.save.mockResolvedValue({});

      const errors = await validate(addMenuDTO);
      expect(errors).toHaveLength(0);
      expect(
        menuService.addMenuItem(addMenuDTO, '', ''),
      ).resolves.toStrictEqual(
        new CommonResDto(
          false,
          'Menu item added now you can add addons of an item',
        ),
      );
    });

    it('foodcategory not found', async () => {
      let addMenuDTO: AddMenuItemDto = plainToInstance(AddMenuItemDto, {
        foodCategoryId: 1,
        foodType: FoodType.VEG,
        itemName: 'Heavy item',
        itemDescription: 'Bhare ITEM',
        MRP: 10.5,
      });

      dataSource.manager.create.mockResolvedValue(addMenuDTO);
      dataSource.manager.save.mockRejectedValue({ code: 23503 });

      const errors = await validate(addMenuDTO);
      expect(errors).toHaveLength(0);
      expect(menuService.addMenuItem(addMenuDTO, '', '')).rejects.toThrow(
        new BadRequestException('Food category not found'),
      );
    });

    it('menu item already exists', async () => {
      let addMenuDTO: AddMenuItemDto = plainToInstance(AddMenuItemDto, {
        foodCategoryId: 1,
        foodType: FoodType.VEG,
        itemName: 'Heavy item',
        itemDescription: 'Bhare ITEM',
        MRP: 10.5,
      });

      dataSource.manager.create.mockResolvedValue(addMenuDTO);
      dataSource.manager.save.mockRejectedValue({ code: 23505 });

      const errors = await validate(addMenuDTO);
      expect(errors).toHaveLength(0);
      expect(menuService.addMenuItem(addMenuDTO, '', '')).rejects.toThrow(
        new BadRequestException('Menu item already exists'),
      );
    });

    it('Should throw execption', async () => {
      let addMenuDTO: AddMenuItemDto = plainToInstance(AddMenuItemDto, {
        foodCategoryId: 1,
        foodType: FoodType.VEG,
        itemName: 'Heavy item',
        itemDescription: 'Bhare ITEM',
        MRP: 10.5,
      });

      dataSource.manager.create.mockResolvedValue(addMenuDTO);
      dataSource.manager.save.mockRejectedValue(new HttpException('', 102, {}));

      const errors = await validate(addMenuDTO);
      expect(errors).toHaveLength(0);
      expect(menuService.addMenuItem(addMenuDTO, '', '')).rejects.toThrow(
        new BadRequestException(
          'Unable add menu item try again after some time.',
        ),
      );
    });
  });

  describe('delete menu item', () => {
    it('Should delete menu item ', async () => {
      dataSource.manager.transaction.mockResolvedValue(true);

      let deleteItemDTO: DeleteMenuItemRequestDTO = plainToInstance(
        DeleteMenuItemRequestDTO,
        {
          itemId: 1,
        },
      );
      const restaurantId = '';
      const result = menuService.deleteMenuItem(restaurantId, deleteItemDTO);

      expect(await validate(deleteItemDTO)).toHaveLength(0);
      expect(result).resolves.toStrictEqual(
        new CommonResDto(
          false,
          'Menu item and related Addons deleted successfuly',
        ),
      );
    });

    it('menu item not found', async () => {
      dataSource.manager.transaction.mockResolvedValue(false);

      let deleteItemDTO: DeleteMenuItemRequestDTO = plainToInstance(
        DeleteMenuItemRequestDTO,
        {
          itemId: 1,
        },
      );
      const restaurantId = '';
      const result = menuService.deleteMenuItem(restaurantId, deleteItemDTO);

      expect(await validate(deleteItemDTO)).toHaveLength(0);
      expect(result).rejects.toThrow(
        new BadRequestException('Menu item not found'),
      );
    });
  });

  describe('Update Availibility', () => {
    const updateAvaililibilyParams = plainToInstance(
      UpdateAvaililibilyParamDTO,
      {
        itemId: 1,
      },
    );
    const updateAvaililibilybody = plainToInstance(UpdateAvaililibilyBodyDTO, {
      isAvailable: false,
    });

    it('Should return common response', async () => {
      expect(await validate(updateAvaililibilyParams)).toHaveLength(0);
      expect(await validate(updateAvaililibilybody)).toHaveLength(0);

      dataSource.manager.update.mockResolvedValue({ affected: 1 });
      dataSource.manager.find.mockResolvedValue([{}]);

      let result = menuService.updateProductAvailibility(
        '',
        updateAvaililibilyParams,
        updateAvaililibilybody,
      );

      expect(result).resolves.toStrictEqual(
        new CommonResDto(false, 'Product availibility updated'),
      );
    });

    it('menu item not found', () => {
      dataSource.manager.update.mockResolvedValue({ affected: 0 });
      dataSource.manager.find.mockResolvedValue([{}]);

      let result = menuService.updateProductAvailibility(
        '',
        updateAvaililibilyParams,
        updateAvaililibilybody,
      );

      expect(result).rejects.toThrow(
        new BadRequestException('Product not found'),
      );
    });

    it('Should throw exeption', () => {
      dataSource.manager.update.mockResolvedValue({ affected: 0 });
      dataSource.manager.find.mockRejectedValue({});

      let result = menuService.updateProductAvailibility(
        '',
        updateAvaililibilyParams,
        updateAvaililibilybody,
      );

      expect(result).rejects.toThrow(
        new BadRequestException(
          'Unable to change status please try again after sometime',
        ),
      );
    });
  });

  describe('Update menu item', () => {
    const updateMenuItemBody = plainToInstance(UpdateMenuItemRequestDTO, {
      itemDescription: '1',
      MRP: 10,
    });
    const updateMenuItemParams = plainToInstance(UpdateMenuItemParamsDTO, {
      itemId: 1,
    });

    it('menu item should be updated', async () => {
      expect(await validate(updateMenuItemParams)).toHaveLength(0);
      expect(await validate(updateMenuItemBody)).toHaveLength(0);

      dataSource.manager.update.mockResolvedValue({ affected: 1 });
      dataSource.manager.find.mockResolvedValue([{}]);

      let result = menuService.updateMenuItem(
        '',
        updateMenuItemBody,
        updateMenuItemParams,
        '',
      );

      expect(result).resolves.toStrictEqual(
        new CommonResDto(false, 'Menu item updated'),
      );
    });

    it('menu item not updated because it not exist', async () => {
      expect(await validate(updateMenuItemParams)).toHaveLength(0);
      expect(await validate(updateMenuItemBody)).toHaveLength(0);

      dataSource.manager.update.mockResolvedValue({ affected: 0 });

      let result = menuService.updateMenuItem(
        '',
        updateMenuItemBody,
        updateMenuItemParams,
        '',
      );

      expect(result).rejects.toThrow(
        new BadRequestException('Product not found'),
      );
    });

    it('Should throw Exception', async () => {
      expect(await validate(updateMenuItemParams)).toHaveLength(0);
      expect(await validate(updateMenuItemBody)).toHaveLength(0);

      dataSource.manager.update.mockRejectedValue();

      let result = menuService.updateMenuItem(
        '',
        updateMenuItemBody,
        updateMenuItemParams,
        '',
      );
      expect(result).rejects.toThrow(
        new BadRequestException('Unable to update menuItem'),
      );
    });
  });

  describe('Get menu items', () => {
    it('should get menu items', () => {
      dataSource.manager.find
        .mockResolvedValueOnce([
          {
            itemId: 58,
            restaurantId: 'a4147f02-91c4-45c4-97ff-be6f46006246',
            foodCategoryId: 1,
            itemName: 'Bhaji Pav',
            itemDescription: 'Pav with Bhaji',
            foodType: 'Veg',
            itemImagePath: 'MenuItem-1681974967040-imageedit_1_7515640712.png',
            MRP: '120',
            discount: 0,
            isAvailable: true,
            isDeleted: false,
            ratingAVG: null,
            deletedat: null,
            foodCategory: { categoryId: 1, categoryName: 'Gujarati' },
          },
          {
            itemId: 59,
            restaurantId: 'a4147f02-91c4-45c4-97ff-be6f46006246',
            foodCategoryId: 1,
            itemName: 'Bhel',
            itemDescription: 'Bhel',
            foodType: 'Veg',
            itemImagePath: 'MenuItem-1681975240281-imageedit_1_7515640712.png',
            MRP: '60',
            discount: 0,
            isAvailable: true,
            isDeleted: false,
            ratingAVG: null,
            deletedat: null,
            foodCategory: { categoryId: 1, categoryName: 'Gujarati' },
          },
        ])
        .mockResolvedValueOnce([
          {
            menuAddOnId: 50,
            addOnName: 'cachumber',
            menuItemId: 58,
            addonDescription: 'Kobi Onion kothmir',
            addonPrice: 20,
            isDeleted: false,
            isAvailable: true,
            deletedat: null,
          },
          {
            menuAddOnId: 54,
            addOnName: 'chingari chatni',
            menuItemId: 58,
            addonDescription: 'keshri chatani',
            addonPrice: 20,
            isDeleted: false,
            isAvailable: true,
            deletedat: null,
          },
          {
            menuAddOnId: 51,
            addOnName: 'Lasan ni chatni',
            menuItemId: 58,
            addonDescription: 'lal lal chatni',
            addonPrice: 20,
            isDeleted: false,
            isAvailable: true,
            deletedat: null,
          },
          {
            menuAddOnId: 56,
            addOnName: 'zayka chatni',
            menuItemId: 58,
            addonDescription: 'keshri chatani',
            addonPrice: 20,
            isDeleted: false,
            isAvailable: true,
            deletedat: null,
          },
        ])
        .mockResolvedValue([]);

      let result = menuService.getMenuItems('', 'bhe');
      expect(result).resolves.toStrictEqual(
        new GetMenuItemsResponse(false, 'List Of Menu', [
          {
            itemId: 58,
            restaurantId: 'a4147f02-91c4-45c4-97ff-be6f46006246',
            foodCategoryId: 1,
            itemName: 'Bhaji Pav',
            itemDescription: 'Pav with Bhaji',
            foodType: FoodType.VEG,
            itemImagePath: 'MenuItem-1681974967040-imageedit_1_7515640712.png',
            MRP: 120,
            discount: 0,
            isAvailable: true,
            isDeleted: false,
            ratingAVG: null,
            deletedat: null,
            foodCategory: { categoryId: 1, categoryName: 'Gujarati' },
            addOns: [
              {
                menuAddOnId: 50,
                addOnName: 'cachumber',
                menuItemId: 58,
                addonDescription: 'Kobi Onion kothmir',
                addonPrice: 20,
                isDeleted: false,
                isAvailable: true,
                deletedat: null,
              },
              {
                menuAddOnId: 54,
                addOnName: 'chingari chatni',
                menuItemId: 58,
                addonDescription: 'keshri chatani',
                addonPrice: 20,
                isDeleted: false,
                isAvailable: true,
                deletedat: null,
              },
              {
                menuAddOnId: 51,
                addOnName: 'Lasan ni chatni',
                menuItemId: 58,
                addonDescription: 'lal lal chatni',
                addonPrice: 20,
                isDeleted: false,
                isAvailable: true,
                deletedat: null,
              },
              {
                menuAddOnId: 56,
                addOnName: 'zayka chatni',
                menuItemId: 58,
                addonDescription: 'keshri chatani',
                addonPrice: 20,
                isDeleted: false,
                isAvailable: true,
                deletedat: null,
              },
            ],
          },
          {
            itemId: 59,
            restaurantId: 'a4147f02-91c4-45c4-97ff-be6f46006246',
            foodCategoryId: 1,
            itemName: 'Bhel',
            itemDescription: 'Bhel',
            foodType: FoodType.VEG,
            itemImagePath: 'MenuItem-1681975240281-imageedit_1_7515640712.png',
            MRP: 60,
            discount: 0,
            isAvailable: true,
            isDeleted: false,
            ratingAVG: null,
            deletedat: null,
            foodCategory: { categoryId: 1, categoryName: 'Gujarati' },
            addOns: [],
          },
        ]),
      );
    });

    it('should get menu items', () => {
      dataSource.manager.find
        .mockResolvedValueOnce([
          {
            itemId: 59,
            restaurantId: 'a4147f02-91c4-45c4-97ff-be6f46006246',
            foodCategoryId: 1,
            itemName: 'Bhel',
            itemDescription: 'Bhel',
            foodType: 'Veg',
            itemImagePath: 'MenuItem-1681975240281-imageedit_1_7515640712.png',
            MRP: '60',
            discount: 0,
            isAvailable: true,
            isDeleted: false,
            ratingAVG: null,
            deletedat: null,
            foodCategory: { categoryId: 1, categoryName: 'Gujarati' },
          },
        ])
        .mockResolvedValue([]);

      let result = menuService.getMenuItems('', '');
      expect(result).resolves.toStrictEqual(
        new GetMenuItemsResponse(false, 'List Of Menu', [
          {
            itemId: 59,
            restaurantId: 'a4147f02-91c4-45c4-97ff-be6f46006246',
            foodCategoryId: 1,
            itemName: 'Bhel',
            itemDescription: 'Bhel',
            foodType: FoodType.VEG,
            itemImagePath: 'MenuItem-1681975240281-imageedit_1_7515640712.png',
            MRP: 60,
            discount: 0,
            isAvailable: true,
            isDeleted: false,
            ratingAVG: null,
            deletedat: null,
            foodCategory: { categoryId: 1, categoryName: 'Gujarati' },
            addOns: [],
          },
        ]),
      );
    });

    it('should throw not found Exception', () => {
      dataSource.manager.find.mockResolvedValue([]);
      expect(menuService.getMenuItems('', '')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw Badrequest Exception', () => {
      dataSource.manager.find.mockRejectedValue();

      expect(menuService.getMenuItems('', '')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('get food categories', () => {
    it('it should return Food categories', () => {
      const foodCates = [
        {
          categoryId: 1,
          categoryName: 'Gujarati',
        },
        {
          categoryId: 2,
          categoryName: 'Punjabi',
        },
        {
          categoryId: 3,
          categoryName: 'South Indian',
        },
        {
          categoryId: 4,
          categoryName: 'Mexican',
        },
        {
          categoryId: 5,
          categoryName: 'Chinese',
        },
      ];
      dataSource.manager.find.mockResolvedValue(foodCates);

      expect(menuService.getFoodCategoryTypes()).resolves.toStrictEqual(
        new FoodCatesResponse(false, 'Food categories retrived', foodCates),
      );
    });

    it('it should return Food categories', () => {
      dataSource.manager.find.mockRejectedValue();

      expect(menuService.getFoodCategoryTypes()).resolves.toStrictEqual(
        new CommonResDto(true, 'Error in retriving data'),
      );
    });
  });
});
