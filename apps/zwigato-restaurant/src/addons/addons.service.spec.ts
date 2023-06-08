import { Test, TestingModule } from '@nestjs/testing';
import { AddonsService } from './addons.service';
import { DataSource } from 'typeorm';
import { CommonResDto } from 'src/dto/commonResponse.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AddonList } from './dto/response/getAddOnResponse.dto';

describe('addOn', () => {
  let addonsService: AddonsService;
  let dataSource;
  let geoCodding;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddonsService,
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
              softDelete:jest.fn()
            },
          },
        },
      ],
    }).compile();

    addonsService = module.get<AddonsService>(AddonsService);
    dataSource = module.get<DataSource>('DataSource');
  });

  describe('Add AddOn item', () => {
    it('add addons', async () => {
      dataSource.manager.findOne.mockResolvedValue({
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
      });
      dataSource.manager.create.mockResolvedValue();
      const addData = await addonsService.addAddOn(
        {
          menuItemId: 46,
          addOnName: 'keshri chatni',
          addonDescription: 'keshri chatani',
          addonPrice: 20,
        },
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
      );
      expect(addData).toBeInstanceOf(CommonResDto);
    });

    it('Menu item is not exist ', async () => {
      dataSource.manager.findOne.mockResolvedValue();
      dataSource.manager.create.mockResolvedValue();
      const addData = addonsService.addAddOn(
        {
          menuItemId: 46,
          addOnName: 'keshri chatni',
          addonDescription: 'keshri chatani',
          addonPrice: 20,
        },
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
      );
      expect(addData).rejects.toThrow(BadRequestException);
      expect(addData).rejects.toThrow('Menu item is not exist');
    });

    it('MenuItem Not Found', async () => {
      dataSource.manager.findOne.mockRejectedValue({ code: 23503 });

      const addData = addonsService.addAddOn(
        {
          menuItemId: 46,
          addOnName: 'keshri chatni',
          addonDescription: 'keshri chatani',
          addonPrice: 20,
        },
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
      );

      await expect(addData).rejects.toThrow(BadRequestException);
      await expect(addData).rejects.toThrow('MenuItem Not Found');
    });

    it('addon already exist', async () => {
      dataSource.manager.findOne.mockRejectedValue({ code: 23505 });

      const addData = addonsService.addAddOn(
        {
          menuItemId: 46,
          addOnName: 'keshri chatni',
          addonDescription: 'keshri chatani',
          addonPrice: 20,
        },
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
      );

      await expect(addData).rejects.toThrow(BadRequestException);
      await expect(addData).rejects.toThrow(
        'Addon already exists for given menu item',
      );
    });
  });

  describe('getAddons', () => {
    it('get addons', async () => {
      dataSource.manager.find.mockResolvedValue([
        {
          menuAddOnId: 56,
          addOnName: 'zayka chatni',
          menuItemId: 58,
          addonDescription: 'keshri chatani',
          addonPrice: '20',
        },
      ]);
      const findAddons = await addonsService.getAddons(
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
        { query: 'javar' },
      );
      expect(findAddons).toBeInstanceOf(AddonList);
    });

    it('addons not found ', async () => {
      dataSource.manager.find.mockResolvedValue([]);
      const findAddons = addonsService.getAddons(
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
        { query: 'javar' },
      );
      expect(findAddons).rejects.toThrow(
        new NotFoundException('Menu items not found'),
      );
    });
  });

  describe('update addons', () => {
    it('updateAddons', async () => {
      dataSource.manager.findOne.mockResolvedValue({
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
        addOns: [
          {
            menuAddOnId: 58,
            addOnName: 'rayka chatni',
            menuItemId: 58,
            addonDescription: 'ramni chatni',
            addonPrice: '20',
            isDeleted: false,
            isAvailable: true,
            deletedat: null,
          },
        ],
      });
      dataSource.manager.update.mockResolvedValue({ affected: 1 });

      const updateData = await addonsService.updateAddons(
        'b153dee4-b1b0-4f2c-a124-cf93ad3e2796',
        { menuAddOnId: 5 },
        {
          addonDescription: 'tikhi chatni',
          addonPrice: 20,
        },
      );
      expect(updateData).toEqual(new CommonResDto(false, 'Addons updated'));
    });

    it('Addons not found', async () => {
      dataSource.manager.findOne.mockResolvedValue({});
      dataSource.manager.update.mockResolvedValue({ affected: 0 });

      const updateData = addonsService.updateAddons(
        'b153dee4-b1b0-4f2c-a124-cf93ad3e2796',
        { menuAddOnId: 5 },
        {
          addonDescription: 'tikhi chatni',
          addonPrice: 20,
        },
      );
      expect(updateData).rejects.toThrow(
        new BadRequestException('Addons not found'),
      );
    });


  

    it('updateAddOnAvailibility', async () => {
      dataSource.manager.find.mockResolvedValue([
        {
          restaurantId: 'a4147f02-91c4-45c4-97ff-be6f46006246',
          restaurantName: 'Kaka ni Bhaji PAV',
          restaurantTypeId: 6,
          restaurantAddressLine1: 'Nana chiloda circle',
          restaurantAddressLine2: '',
          pincode: '382330',
          city: 'Ahmedabad',
          state: 'gujrat',
          restaurantLatitude: '23.069369941195227',
          restaurantLongitude: '72.52518965294583',
          restaurantEmail: 'grabopportunity82@gmail.com',
          restaurantPassword:
            '$2a$10$uFQdTfDicjqGLiuvLV.07emUACYsEIanFT5gch5M0s8MabInJML4q',
          restaurantPhone: '6351884585',
          managerId: null,
          pancard: '212655465565',
          gstNumber: 'nbkjjkscjklcsklj',
          fssai: '32522355865',
          logoPath: '1681973555565-imageedit_1_7515640712.png',
          bankName: '28823884242',
          bankIFSC: '424242424242',
          bankAccountNumber: 'fwwfwfwrrwrw',
          isVerified: true,
          isActive: true,
          passBookImagePath: '1681973555567-imageedit_1_7515640712.png',
          OTP: null,
          isEmailVerified: true,
          isDeleted: false,
          registerdAt: '2023-04-20T06:52:35.889Z',
          joinedDate: null,
          firstOrderDate: null,
          restaurantMenu: [
            {
              itemId: 58,
              restaurantId: 'a4147f02-91c4-45c4-97ff-be6f46006246',
              foodCategoryId: 1,
              itemName: 'Bhaji Pav',
              itemDescription: 'Pav with Bhaji',
              foodType: 'Veg',
              itemImagePath:
                'MenuItem-1681974967040-imageedit_1_7515640712.png',
              MRP: '120',
              discount: 0,
              isAvailable: true,
              isDeleted: false,
              ratingAVG: null,
              deletedat: null,
              addOns: [
                {
                  menuAddOnId: 58,
                  addOnName: 'rayka chatni',
                  menuItemId: 58,
                  addonDescription: 'gamni chatni',
                  addonPrice: '20',
                  isDeleted: false,
                  isAvailable: false,
                  deletedat: null,
                },
              ],
            },
          ],
        },
      ]);
      dataSource.manager.update.mockResolvedValue({ affected: 1 });
      const findData = await addonsService.updateAddOnAvailibility(
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
        { menuAddOnId: 5 },
        {
          isAvailable: false,
        },
      );
      expect(findData).toEqual(
        new CommonResDto(false, 'AddOn availibility updated'),
      );
    });

    it('not found for update', async () => {
      dataSource.manager.find.mockResolvedValue([]);
      dataSource.manager.update.mockResolvedValue({ affected: 0 });
      const findData = addonsService.updateAddOnAvailibility(
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
        { menuAddOnId: 5 },
        {
          isAvailable: false,
        },
      );
      expect(findData).rejects.toThrow(
        new BadRequestException('AddOn Item Not Found...'),
      );
    });


  });

  describe('deleteaddon', () => {
    it('deleteAddon', async () => {
      dataSource.manager.findOne.mockResolvedValue({
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
        addOns: [
          {
            menuAddOnId: 58,
            addOnName: 'rayka chatni',
            menuItemId: 58,
            addonDescription: 'gamni chatni',
            addonPrice: '20',
            isDeleted: false,
            isAvailable: false,
            deletedat: null,
          },
        ],
      });
      dataSource.manager.update.mockResolvedValue({ affected: 1 });
      dataSource.manager.softDelete.mockResolvedValue();

      let deleteAddon = await addonsService.deleteAddon(
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
        { menuAddOnId: 5 },
      );
      expect(deleteAddon).toEqual(new CommonResDto(false, 'Addons deleted successfuly'))
    });

    it('deleteAddon not found', async () => {
      dataSource.manager.findOne.mockResolvedValue();
      // dataSource.manager.update.mockResolvedValue({ affected: 1 });
      // dataSource.manager.softDelete.mockResolvedValue();

      let deleteAddon =  addonsService.deleteAddon(
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
        { menuAddOnId: 5 },
      );
      expect(deleteAddon).rejects.toThrow(new BadRequestException('Addon not found'))
    });
  });
});
