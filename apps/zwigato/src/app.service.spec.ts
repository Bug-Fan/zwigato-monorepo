import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { GetRestaurantResponseDto } from './dto/response/restaurant.response.dto';
import { BadGatewayException, NotFoundException } from '@nestjs/common';

describe(' Test AppServiceSuite', () => {
  let Service: AppService;
  let dataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: 'DataSource',
          useValue: {
            manager: {
              find: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    dataSource = module.get<DataSource>('DataSource');
    Service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(Service).toBeDefined();
  });

  describe('getItems', () => {
    it('takes pincode and throws notFoundException if no data is found', () => {
      const mockRestoReqDto = {
        pincode: '300000',
        search: undefined,
      };

      dataSource.manager.find.mockResolvedValue({});

      expect(Service.getItems(mockRestoReqDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('takes pincode and returns active restaurants and their menus around pincode area', async () => {
      const mockRestoReqDto = {
        pincode: '300000',
        search: undefined,
      };

      dataSource.manager.find.mockResolvedValue([
        {
          city: 'Ahmedabad',
          pincode: '382330',
          restaurantMenu: [
            {
              itemId: 42,
              itemName: 'Sandwich',
              itemDescription: 'cheese wali',
              MRP: '120',
              isAvailable: true,
              ratingAVG: null,
              addOns: [
                {
                  menuAddOnId: 32,
                  addOnName: 'extra cheese',
                  addonDescription: 'extra cheese',
                  addonPrice: '8',
                },
                {
                  menuAddOnId: 33,
                  addOnName: 'Pepsi',
                  addonDescription: 'pepsi',
                  addonPrice: '10',
                },
              ],
            },
            {
              itemId: 45,
              itemName: 'Dabel',
              itemDescription: 'cheese wali',
              MRP: '120',
              isAvailable: true,
              ratingAVG: '5',
              addOns: [
                {
                  menuAddOnId: 37,
                  addOnName: 'lal chatni',
                  addonDescription: 'lal chatani',
                  addonPrice: '10',
                },
                {
                  menuAddOnId: 39,
                  addOnName: 'Tikhi chatni',
                  addonDescription: 'Tikhi chatani',
                  addonPrice: '20',
                },
              ],
            },
          ],
          restaurantName: 'Sankalp ',
          restaurantId: 'b153dee4-b1b0-4f2c-a124-cf93ad3e2796',
        },
      ]);

      expect(Service.getItems(mockRestoReqDto)).resolves.toBeInstanceOf(
        GetRestaurantResponseDto,
      );
    });

    it('throws badGatewayException if database query fails', async () => {
      const mockRestoReqDto = {
        pincode: '300000',
        search: undefined,
      };

      dataSource.manager.find.mockRejectedValue({});

      expect(Service.getItems(mockRestoReqDto)).rejects.toThrow(
        BadGatewayException,
      );
    });
  });
});
