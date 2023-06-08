import { Test } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { GeoCoddingService } from '../geocode.service';
import { CartService } from './cart.service';
import { EmailService } from '../email/email.service';
import { DataSource } from 'typeorm';
import { OrderHistoryResponseDto } from './dto/response/order.history.response.dto';
import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { OrderPlacedResponseDto } from './dto/response/order.placed.response.dto';
import { OrderPayResponseDto } from './dto/response/order.pay.response.dto';
import { OrderStatus } from '../db/entities/order.entity';

describe('Orders Test suite', () => {
  let Service: OrdersService, dataSource, geoCodeService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: EmailService, useValue: { send: jest.fn() } },
        {
          provide: CartService,
          useValue: {
            calculateSubtotal: jest.fn(),
            applyCouponCode: jest.fn(),
          },
        },
        {
          provide: GeoCoddingService,
          useValue: {
            findDistance: jest.fn(),
          },
        },
        {
          provide: 'DataSource',
          useValue: {
            manager: {
              find: jest.fn(),
              findOne: jest.fn(),
              transaction: jest.fn(),
              findOneBy: jest.fn(),
              findAndCount: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    Service = module.get<OrdersService>(OrdersService);
    dataSource = module.get<DataSource>('DataSource');
    geoCodeService = module.get<GeoCoddingService>(GeoCoddingService);
  });

  it('should be defined', () => {
    expect(Service).toBeDefined();
  });

  describe('getOrderHistory', () => {
    const mockCustomerId = 'qkug112-kegd1-dkgf';

    it('should fetch order history', () => {
      dataSource.manager.find.mockResolvedValue([
        {
          orderId: 'a2fb5dee-60ca-484b-ab49-8a43de3b2381',
          restaurantId: 'a4147f02-91c4-45c4-97ff-be6f46006246',
          deliveryAddress: '105, Bayad, 380059, Gujarat',
          subTotal: '840',
          totalAmount: '931.63',
          deliveryCharges: '66.42999999999999',
          prepareTime: '25',
          orderStatus: 'DELIVERED',
          discountedPrice: '714',
          deliveryRatings: null,
          deliveryRemarks: null,
          rejectionReason: null,
          deliveredOn: '2023-04-20T12:01:26.329Z',
          orderPlacedOn: '2023-04-20T11:53:50.425Z',
          orderItems: [
            {
              itemId: '58',
              itemName: 'Bhaji Pav',
              quantity: '7',
              itemTotalAmount: '840',
              itemPrice: '120',
              orderAddOn: [],
            },
          ],
          deliveryAgent: {
            agentName: 'Johny',
          },
          coupon: {
            couponCodeName: 'JETHABHAI123',
          },
        },
      ]);

      return expect(Service.getOrderHistory(mockCustomerId)).resolves.toEqual({
        isError: false,
        message: 'Order History fetched',
        data: {
          order: [
            {
              orderId: 'a2fb5dee-60ca-484b-ab49-8a43de3b2381',
              restaurantId: 'a4147f02-91c4-45c4-97ff-be6f46006246',
              deliveryAddress: '105, Bayad, 380059, Gujarat',
              subTotal: '840',
              totalAmount: '931.63',
              deliveryCharges: '66.42999999999999',
              prepareTime: '25',
              orderStatus: 'DELIVERED',
              discountedPrice: '714',
              deliveryRatings: null,
              deliveryRemarks: null,
              rejectionReason: null,
              deliveredOn: '2023-04-20T12:01:26.329Z',
              orderPlacedOn: '2023-04-20T11:53:50.425Z',
              orderItems: [
                {
                  itemId: '58',
                  itemName: 'Bhaji Pav',
                  quantity: '7',
                  itemTotalAmount: '840',
                  itemPrice: '120',
                  orderAddOn: [],
                },
              ],
              deliveryAgent: {
                agentName: 'Johny',
              },
              coupon: {
                couponCodeName: 'JETHABHAI123',
              },
            },
          ],
        },
      });
    });

    it('should throw not found exception if no orders found', () => {
      dataSource.manager.find.mockResolvedValue([]);

      return expect(Service.getOrderHistory(mockCustomerId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw bad gateway exception if query fails', () => {
      dataSource.manager.find.mockRejectedValue({ status: 502 });

      return expect(Service.getOrderHistory(mockCustomerId)).rejects.toThrow(
        BadGatewayException,
      );
    });
  });

  describe('placeOrder', () => {
    const mockCustomerId = 'qkug112-kegd1-dkgf',
      mockAddressId = 1;

    it('should place order', () => {
      Service.validateAddress = jest.fn().mockResolvedValue(true);

      dataSource.manager.find.mockResolvedValue(['cartItem1']);

      Service.validateRestaurant = jest.fn().mockResolvedValue(true);

      Service.validateCart = jest.fn().mockResolvedValue(true);

      Service.calculateDistance = jest.fn().mockResolvedValue(10);

      Service.createOrder = jest.fn().mockResolvedValue('orderId');

      return expect(
        Service.placeOrder(mockCustomerId, mockAddressId),
      ).resolves.toEqual({
        isError: false,
        message: 'You can now got to payment.',
        data: { orderId: 'orderId' },
      });
    });

    it('should throw not found exception if address is not found', () => {
      Service.validateAddress = jest.fn().mockResolvedValue(false);

      return expect(
        Service.placeOrder(mockCustomerId, mockAddressId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw bad request exception if cart is empty', () => {
      Service.validateAddress = jest.fn().mockResolvedValue(true);

      dataSource.manager.find.mockResolvedValue([]);

      return expect(
        Service.placeOrder(mockCustomerId, mockAddressId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw bad request exception if restaurant is inactive', () => {
      Service.validateAddress = jest.fn().mockResolvedValue(true);

      dataSource.manager.find.mockResolvedValue(['cartItem1']);

      Service.validateRestaurant = jest.fn().mockResolvedValue(false);

      return expect(
        Service.placeOrder(mockCustomerId, mockAddressId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw bad gateway exception if any cart item or addon is not available', () => {
      Service.validateAddress = jest.fn().mockResolvedValue(true);

      dataSource.manager.find.mockResolvedValue(['cartItem1']);

      Service.validateRestaurant = jest.fn().mockResolvedValue(true);

      Service.validateCart = jest.fn().mockRejectedValue({
        status: 1004,
        options: {
          description:
            '`The Items: are not available at the moment. Hence we are unable to place order.`',
        },
      });

      return expect(
        Service.placeOrder(mockCustomerId, mockAddressId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw bad request exception if restaurant range is more than 10 km', () => {
      Service.validateAddress = jest.fn().mockResolvedValue(true);

      dataSource.manager.find.mockResolvedValue(['cartItem1']);

      Service.validateRestaurant = jest.fn().mockResolvedValue(true);

      Service.validateCart = jest.fn().mockResolvedValue(true);

      Service.calculateDistance = jest.fn().mockResolvedValue(-1);

      return expect(
        Service.placeOrder(mockCustomerId, mockAddressId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw bad gateway exception if database operation fails', () => {
      Service.validateAddress = jest.fn().mockResolvedValue(true);

      dataSource.manager.find.mockResolvedValue(['cartItem1']);

      Service.validateRestaurant = jest.fn().mockResolvedValue(true);

      Service.validateCart = jest.fn().mockResolvedValue(true);

      Service.calculateDistance = jest.fn().mockResolvedValue(10);

      Service.createOrder = jest.fn().mockRejectedValue({ status: 502 });

      return expect(
        Service.placeOrder(mockCustomerId, mockAddressId),
      ).rejects.toThrow(BadGatewayException);
    });

    it('should throw bad gateway exception if geocoding service is offline', () => {
      Service.validateAddress = jest.fn().mockResolvedValue(true);

      dataSource.manager.find.mockResolvedValue(['cartItem1']);

      Service.validateRestaurant = jest.fn().mockResolvedValue(true);

      Service.validateCart = jest.fn().mockResolvedValue(true);

      Service.calculateDistance = jest.fn().mockRejectedValue({
        status: 1061,
        options: {
          description:
            'We do not deliver orders if you are more than 10 km far than restaurant.',
        },
      });
      return expect(
        Service.placeOrder(mockCustomerId, mockAddressId),
      ).rejects.toThrow(BadGatewayException);
    });
  });

  describe('trackOrder', () => {
    const mockCustomerId = 'qkug112-kegd1-dkgf',
      mockOrderId = 'edkwubkiow';

    it('should return tracking info', () => {
      dataSource.manager.find.mockResolvedValue([
        {
          deliveryAddress: '105, Bayad, 380059, Gujarat',
          subTotal: '840',
          totalAmount: '931.63',
          prepareTime: '25',
          orderStatus: 'DELIVERED',
          discountedPrice: '714',
          rejectionReason: null,
          orderPlacedOn: '2023-04-20T11:53:50.425Z',
          orderItems: [
            {
              itemId: '58',
              itemName: 'Bhaji Pav',
              quantity: '7',
              orderAddOn: [],
            },
          ],
          deliveryAgent: {
            agentName: 'Johny',
            agentLatitude: '23.071443083114822',
            agentLongitude: '72.51682813915245',
            agentPhone: '4546676545',
          },
          coupon: {
            couponCodeName: 'JETHABHAI123',
          },
        },
      ]);

      return expect(
        Service.trackOrder(mockCustomerId, mockOrderId),
      ).resolves.toEqual({
        isError: false,
        message: 'Order Data fetched',
        data: {
          order: [
            {
              deliveryAddress: '105, Bayad, 380059, Gujarat',
              subTotal: '840',
              totalAmount: '931.63',
              prepareTime: '25',
              orderStatus: 'DELIVERED',
              discountedPrice: '714',
              rejectionReason: null,
              orderPlacedOn: '2023-04-20T11:53:50.425Z',
              orderItems: [
                {
                  itemId: '58',
                  itemName: 'Bhaji Pav',
                  quantity: '7',
                  orderAddOn: [],
                },
              ],
              deliveryAgent: {
                agentName: 'Johny',
                agentLatitude: '23.071443083114822',
                agentLongitude: '72.51682813915245',
                agentPhone: '4546676545',
              },
              coupon: {
                couponCodeName: 'JETHABHAI123',
              },
            },
          ],
        },
      });
    });

    it('should throw not found exception if order is not found', () => {
      dataSource.manager.find.mockResolvedValue([]);

      return expect(
        Service.trackOrder(mockCustomerId, mockOrderId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw bad gateway exception if query fails', () => {
      dataSource.manager.find.mockRejectedValue({ status: 502 });

      return expect(
        Service.trackOrder(mockCustomerId, mockOrderId),
      ).rejects.toThrow(BadGatewayException);
    });
  });

  describe('payForOrder', () => {
    const mockCustomerId = 'qkug112-kegd1-dkgf',
      mockOrderId = 'edkwubkiow';

    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    it('should pay for order', async () => {
      dataSource.manager.transaction.mockResolvedValue(true);

      dataSource.manager.findOne.mockResolvedValue({ restaurantEmail: 'abc' });

      return expect(
        Service.payForOrder(mockOrderId, mockCustomerId),
      ).resolves.toEqual({
        isError: false,
        message: 'Order placed and payment complete.',
      });
    });

    it('should throw bad request exception if transaction fails', () => {
      dataSource.manager.transaction.mockResolvedValue(false);

      return expect(
        Service.payForOrder(mockOrderId, mockCustomerId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw bad request exception if query or email service fails', () => {
      dataSource.manager.transaction.mockRejectedValue({ status: 502 });

      return expect(
        Service.payForOrder(mockOrderId, mockCustomerId),
      ).rejects.toThrow(BadGatewayException);
    });
  });

  describe('validateAddress', () => {
    const mockCustomerId = 'qkug112-kegd1-dkgf',
      mockAddressId = 1;

    it('should return true is address is valid', () => {
      dataSource.manager.findOneBy.mockResolvedValue({ addressId: 1 });

      return expect(
        Service.validateAddress(mockAddressId, mockCustomerId),
      ).resolves.toBe(true);
    });

    it('should return false is address not found', () => {
      dataSource.manager.findOneBy.mockResolvedValue();

      return expect(
        Service.validateAddress(mockAddressId, mockCustomerId),
      ).resolves.toBe(false);
    });

    it('should throw bad gateway exception if query fails', () => {
      dataSource.manager.findOneBy.mockRejectedValue({ status: 502 });

      return expect(
        Service.validateAddress(mockAddressId, mockCustomerId),
      ).rejects.toThrow(BadGatewayException);
    });
  });

  describe('validateRestaurant', () => {
    const mockRestaurantId = 'resId';

    it('should return true if restaurant is available', () => {
      dataSource.manager.findOneBy.mockResolvedValue({ restaurantId: 'resId' });

      return expect(Service.validateRestaurant(mockRestaurantId)).resolves.toBe(
        true,
      );
    });

    it('should return false if restaurant is available', () => {
      dataSource.manager.findOneBy.mockResolvedValue();

      return expect(Service.validateRestaurant(mockRestaurantId)).resolves.toBe(
        false,
      );
    });

    it('should throw bad gateway exception if query fails', () => {
      dataSource.manager.findOneBy.mockRejectedValue();

      return expect(
        Service.validateRestaurant(mockRestaurantId),
      ).rejects.toThrow(BadGatewayException);
    });
  });

  describe('validateCart', () => {
    const mockCustomerId = 'qkug112-kegd1-dkgf';

    it('should return true if cart items and addons are available', () => {
      dataSource.manager.findAndCount
        .mockResolvedValueOnce([{}, 0])
        .mockResolvedValueOnce([{}, 0]);

      return expect(Service.validateCart(mockCustomerId)).resolves.toBe(true);
    });

    it('should throw Http exception if any cart item is not available', () => {
      dataSource.manager.findAndCount.mockResolvedValueOnce([
        { cartItem: 'cartItem1' },
        1,
      ]);

      return expect(Service.validateCart(mockCustomerId)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw Http exception if any cart addon is not available', () => {
      dataSource.manager.findAndCount
        .mockResolvedValueOnce([{}, 0])
        .mockResolvedValueOnce([{ cartAddon: 'cartAddon1' }, 1]);

      return expect(Service.validateCart(mockCustomerId)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('calculateDistance', () => {
    const mockCustomerId = 'qkug112-kegd1-dkgf',
      mockAddressId = 1,
      mockRestaurantId = 'ResId';

    it('should return distance', () => {
      dataSource.manager.findOneBy
        .mockResolvedValueOnce({ coordinates: {} })
        .mockResolvedValueOnce({ coordinates: {} });

      geoCodeService.findDistance.mockResolvedValue(5);

      return expect(
        Service.calculateDistance(
          mockAddressId,
          mockCustomerId,
          mockRestaurantId,
        ),
      ).resolves.toEqual(5);
    });

    it('should return -1 if distance between restaurant and customer is more than 10 km', () => {
      dataSource.manager.findOneBy
        .mockResolvedValueOnce({ coordinates: {} })
        .mockResolvedValueOnce({ coordinates: {} });

      geoCodeService.findDistance.mockResolvedValue(20);

      return expect(
        Service.calculateDistance(
          mockAddressId,
          mockCustomerId,
          mockRestaurantId,
        ),
      ).resolves.toEqual(-1);
    });

    it('should throw http exception if query or geocoding api fails', () => {
      dataSource.manager.findOneBy
        .mockResolvedValueOnce({ coordinates: {} })
        .mockResolvedValueOnce({ coordinates: {} });

      geoCodeService.findDistance.mockRejectedValue();

      return expect(
        Service.calculateDistance(
          mockAddressId,
          mockCustomerId,
          mockRestaurantId,
        ),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('cancelOrderByUser', () => {
    const mockCustomerId = 'qkug112-kegd1-dkgf',
      mockOrderId = 'edkwubkiow';

    it('should cancel order', () => {
      dataSource.manager.findOne.mockResolvedValue({
        orderStatus: OrderStatus.PAID,
        isrestaurantAccepted: false,
      });

      dataSource.manager.update.mockResolvedValue({ affected: 1 });

      return expect(
        Service.cancelOrderByUser(mockOrderId, mockCustomerId),
      ).resolves.toEqual({
        isError: false,
        message: 'Order cancelled successfully.',
      });
    });

    it('should throw bad request exception if restaurant has accepted order', () => {
      dataSource.manager.findOne.mockResolvedValue({
        orderStatus: OrderStatus.PAID,
        isrestaurantAccepted: true,
      });

      return expect(
        Service.cancelOrderByUser(mockOrderId, mockCustomerId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw bad request exception if order is already cancelled', () => {
      dataSource.manager.findOne.mockResolvedValue({
        orderStatus: OrderStatus.CANCELED,
        isrestaurantAccepted: false,
      });

      return expect(
        Service.cancelOrderByUser(mockOrderId, mockCustomerId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw bad gateway exception if any query fails', () => {
      dataSource.manager.findOne.mockRejectedValue({ status: 502 });

      return expect(
        Service.cancelOrderByUser(mockOrderId, mockCustomerId),
      ).rejects.toThrow(BadGatewayException);
    });
  });
});
