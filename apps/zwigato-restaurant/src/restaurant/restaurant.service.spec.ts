import { TestingModule, Test } from '@nestjs/testing';

import { DataSource } from 'typeorm';
import { RestaurantService } from './restaurant.service';
import { plainToInstance } from 'class-transformer';
import { UpdateBankDetailsRequest } from './dto/request/restaurantUpdateBank.request.dto';
import { RestaurantUpdateDto } from './dto/request/restaurantUpdateDetails.request.dto';
import { validate } from 'class-validator';
import { CommonResDto } from 'src/dto/commonResponse.dto';
import { BadRequestException } from '@nestjs/common';
import { UpdateRestaurantAvailibilityDTO } from './dto/request/updateRestaurantAvailability.request.dto';
import { EarningRequestDTO } from './dto/request/earning.request.dto';
import { EarningRes, EarningResDTO } from './dto/response/earning.res.dto';
import { RestaurantProfileRes } from './dto/response/restaurantData.res.dto';
import { Restaurant } from 'src/database/entities/restaurant.entity';
import { resolve } from 'path';

describe('Restaurant service', () => {
  let restaurantService: RestaurantService;
  let dataSource;
  let queryBuilder = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
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
              createQueryBuilder: jest.fn(() => queryBuilder),
            },
          },
        },
      ],
    }).compile();

    dataSource = module.get<DataSource>('DataSource');
    restaurantService = module.get<RestaurantService>(RestaurantService);
  });

  describe('Update restaurant', () => {
    it('should update restaurant details', async () => {
      dataSource.manager.update.mockResolvedValue({ affected: 1 });

      let updateRestDetailsDTO = plainToInstance(RestaurantUpdateDto, {
        logoPath: './123.jpg',
        restaurantPhone: '12345678',
      });

      expect(await validate(UpdateBankDetailsRequest)).toHaveLength(0);
      expect(
        restaurantService.updateRestuarentDetails(updateRestDetailsDTO, '', ''),
      ).resolves.toStrictEqual(
        new CommonResDto(false, 'Data is updated succesfully'),
      );
    });

    it('should return restaurant not found', async () => {
      dataSource.manager.update.mockResolvedValue({ affected: 0 });

      let updateRestDetailsDTO = plainToInstance(RestaurantUpdateDto, {
        logoPath: './123.jpg',
        restaurantPhone: '12345678',
      });

      expect(await validate(UpdateBankDetailsRequest)).toHaveLength(0);
      expect(
        restaurantService.updateRestuarentDetails(updateRestDetailsDTO, '', ''),
      ).resolves.toStrictEqual(new CommonResDto(true, 'Restaurant not found'));
    });

    it('should throw exception', async () => {
      dataSource.manager.update.mockRejectedValue();

      let updateRestDetailsDTO = plainToInstance(RestaurantUpdateDto, {
        logoPath: './123.jpg',
        restaurantPhone: '12345678',
      });

      expect(await validate(UpdateBankDetailsRequest)).toHaveLength(0);
      expect(
        restaurantService.updateRestuarentDetails(updateRestDetailsDTO, '', ''),
      ).rejects.toStrictEqual(
        new BadRequestException('Unable to update the details'),
      );
    });
  });

  describe('update availibility', () => {
    it('should update restaurant details', async () => {
      let updateAvailibility = plainToInstance(
        UpdateRestaurantAvailibilityDTO,
        {
          isAvailable: true,
        },
      );

      dataSource.manager.update.mockResolvedValue({ affected: 1 });

      expect(await validate(updateAvailibility)).toHaveLength(0);
      expect(
        restaurantService.updateAvailibility('', updateAvailibility),
      ).resolves.toStrictEqual(new CommonResDto(false, 'Visiblility changed'));
    });

    it('should return restaurant not found', async () => {
      let updateAvailibility = plainToInstance(
        UpdateRestaurantAvailibilityDTO,
        {
          isAvailable: true,
        },
      );
      dataSource.manager.update.mockResolvedValue({ affected: 0 });

      expect(await validate(updateAvailibility)).toHaveLength(0);
      expect(
        restaurantService.updateAvailibility('', updateAvailibility),
      ).resolves.toStrictEqual(new CommonResDto(true, 'User not found'));
    });

    it('should throw exception', async () => {
      let updateAvailibility = plainToInstance(
        UpdateRestaurantAvailibilityDTO,
        {
          isAvailable: true,
        },
      );
      dataSource.manager.update.mockRejectedValue();

      expect(await validate(updateAvailibility)).toHaveLength(0);
      expect(
        restaurantService.updateAvailibility('', updateAvailibility),
      ).rejects.toStrictEqual(
        new BadRequestException(
          'Unable to change status please try again after sometime',
        ),
      );
    });
  });

  describe('Get restaurnat profile', () => {
    it('should get Restaurant data', async () => {
      const restaurantData = plainToInstance(Restaurant, {
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
        registerdAt: new Date('2023-04-20T06:52:35.889Z'),
        joinedDate: null,
        firstOrderDate: null,
      });

      dataSource.manager.findOne.mockResolvedValue(restaurantData);

      expect(restaurantService.getRestaurantProfile('')).resolves.toStrictEqual(
        new RestaurantProfileRes(false, 'Data Of Restaurant', restaurantData),
      );
    });

    it('should throw exception', async () => {
      dataSource.manager.findOne.mockResolvedValue(null);

      expect(restaurantService.getRestaurantProfile('')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update bank details', () => {
    it('Should update bank details of user', async () => {
      let bankDetailsDTO = plainToInstance(UpdateBankDetailsRequest, {
        bankName: 'string',
        bankIFSC: 'string',
        bankAccountNumber: 'string',
      });

      dataSource.manager.update.mockResolvedValue({ affected: 1 });
      expect(await validate(bankDetailsDTO)).toHaveLength(0);
      let result = restaurantService.updateBankDetails(bankDetailsDTO, '', '');
      expect(result).resolves.toStrictEqual(
        new CommonResDto(false, 'Data is updated succesfully'),
      );
    });

    it('Should update bank details of user', async () => {
      let bankDetailsDTO = plainToInstance(UpdateBankDetailsRequest, {
        bankName: 'string',
        bankIFSC: 'string',
        bankAccountNumber: 'string',
      });

      dataSource.manager.update.mockResolvedValue({ affected: 0 });
      expect(await validate(bankDetailsDTO)).toHaveLength(0);
      let result = restaurantService.updateBankDetails(bankDetailsDTO, '', '');
      expect(result).resolves.toStrictEqual(
        new CommonResDto(true, 'Restaurant not found'),
      );
    });

    it('Should update bank details of user', async () => {
      let bankDetailsDTO = plainToInstance(UpdateBankDetailsRequest, {
        bankName: 'string',
        bankIFSC: 'string',
        bankAccountNumber: 'string',
      });

      dataSource.manager.update.mockRejectedValue();
      expect(await validate(bankDetailsDTO)).toHaveLength(0);
      let result = restaurantService.updateBankDetails(bankDetailsDTO, '', '');
      expect(result).rejects.toThrow(BadRequestException);
    });
  });

  describe('Earning', () => {
    const start = '2023-04-28';
    const end = '2023-04-29';
    let dto: EarningRequestDTO = { start, end };

    it('Should get earning of restaurant', () => {
      dataSource.manager.createQueryBuilder().execute.mockResolvedValue([
        {
          totalprofit: 100,
          totalorders: 5,
        },
      ]);

      expect(restaurantService.getEarnings(dto, '')).resolves.toStrictEqual(
        new EarningResDTO(
          false,
          'Earning data loaded',
          new EarningRes(
            new Date(start).toISOString(),
            new Date(end).toISOString(),
            100,
            5,
          ),
        ),
      );
    });

    it('should throw badRequest', () => {
      dataSource.manager.createQueryBuilder().execute.mockRejectedValue();
      expect(restaurantService.getEarnings(dto, '')).rejects.toThrow(
        new BadRequestException(
          'unable to retrive earning. Please try again later',
        ),
      );
    });
  });
});
