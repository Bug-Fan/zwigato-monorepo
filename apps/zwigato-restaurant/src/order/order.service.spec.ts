import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { DataSource } from 'typeorm';
import { GeoCoddingService } from './geoCodding.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../database/entities/order.entity';
import { CommonResDto } from '../dto/commonResponse.dto';
import { GetOrderDetailsRes } from './dto/response/getOrderDetails.res.dto';

describe('Order service', () => {
  let orderService;
  let dataSource;
  let geoCodding;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
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
            },
          },
        },
        {
          provide: GeoCoddingService,
          useValue: {
            findDistance: jest.fn(),
          },
        },
      ],
    }).compile();

    dataSource = module.get<DataSource>('DataSource');
    orderService = module.get<OrderService>(OrderService);
    geoCodding = module.get<GeoCoddingService>(GeoCoddingService);
  });

  describe('get Delivery agent', () => {
    it('should return delivery boy', async () => {
      dataSource.manager.findOne.mockResolvedValue({
        orderId: '13ea43be-24f5-427e-8183-cb7afe1dcb0b',
        deliveryAgent: {
          agentId: '047ea9ea-1497-488f-8191-6dd88209fe25',
          agentName: 'Keval joshi',
          agentPhone: '9723535482',
          vehicaleNumber: 'GJ01DR497',
        },
      });

      expect(
        await orderService.getAgent(
          'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
          '13ea43be-24f5-427e-8183-cb7afe1dcb0b',
        ),
      ).toEqual({
        isError: false,
        message: 'DeliveryAgentData',
        orderId: '13ea43be-24f5-427e-8183-cb7afe1dcb0b',
        agent: {
          agentId: '047ea9ea-1497-488f-8191-6dd88209fe25',
          agentName: 'Keval joshi',
          agentPhone: '9723535482',
          vehicaleNumber: 'GJ01DR497',
        },
      });
    });

    it('should return BadRequest', async () => {
      const deliveryAgent = orderService.getAgent(
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
        '13ea43be-24f5-427e-8183-cb7afe1dcb0b',
      );
      expect(deliveryAgent).rejects.toThrow(BadRequestException);
    });
  });

  describe('Update restaurnat status', () => {
    it('should update status', async () => {
      dataSource.manager.update.mockResolvedValue({ affected: 1 });
      const result = await orderService.updateOrderStatus(
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
        '13ea43be-24f5-427e-8183-cb7afe1dcb0b',
        { orderStatus: OrderStatus.PREPARING, prepareTime: 20 },
      );

      expect(result).toBeInstanceOf(CommonResDto);
    });
    it('should update status', async () => {
      dataSource.manager.update.mockResolvedValue({ affected: 0 });
      const result = orderService.updateOrderStatus(
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
        '13ea43be-24f5-427e-8183-cb7afe1dcb0b',
        { orderStatus: OrderStatus.PREPARING, prepareTime: 20 },
      );
      expect(result).rejects.toThrow(BadRequestException);
    });
  });

  describe('Restaurant status accept', () => {
    jest.useFakeTimers();
    it('Should Accept order and return Order Data', async () => {
      dataSource.manager.update.mockResolvedValue({ affected: 1 });
      dataSource.manager.findOne.mockResolvedValueOnce({
        orderId: '13ea43be-24f5-427e-8183-cb7afe1dcb0b',
        customer: {
          customerId: true,
          customerName: 'keval joshi',
          customerPhone: '1234567890',
        },
        restaurant: {
          restaurantLatitude: '23.068586',
          restaurantLongitude: '72.653595',
        },
        orderStatus: OrderStatus.PREPARING,
        isrestaurantAccepted: true,
        isDeliveryAccepted: true,
        orderItems: [
          {
            orderItemId: 27,
            itemName: 'Bhel puri',
            quantity: 3,
            itemTotalAmount: 200,
            orderAddOn: [
              {
                orderAddonName: 'Dhai',
                orderAddOnId: 2,
                orderAddOnPrice: 10,
                quantity: 2,
                totalAddonPrice: 20,
              },
            ],
          },
        ],
      });
      orderService.sendRequestToDeliveryBoy = jest.fn();
      orderService.sendRequestToDeliveryBoy.mockResolvedValue([]);

      const spy = jest.spyOn(orderService, 'sendRequestToDeliveryBoy');

      const result = await orderService.updateConformation(
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
        '13ea43be-24f5-427e-8183-cb7afe1dcb0b',
        true,
      );

      expect(result).toBeInstanceOf(GetOrderDetailsRes);
      expect(spy).toBeCalled();
    });

    it('Should reject order and return Order Data', async () => {
      dataSource.manager.update.mockResolvedValue({ affected: 1 });
      dataSource.manager.findOne.mockResolvedValueOnce({
        orderId: '13ea43be-24f5-427e-8183-cb7afe1dcb0b',
        customer: {
          customerId: true,
          customerName: 'keval joshi',
          customerPhone: '1234567890',
        },
        restaurant: {
          restaurantLatitude: '23.068586',
          restaurantLongitude: '72.653595',
        },
        orderStatus: OrderStatus.PREPARING,
        isrestaurantAccepted: true,
        isDeliveryAccepted: true,
        orderItems: [
          {
            orderItemId: 27,
            itemName: 'Bhel puri',
            quantity: 3,
            itemTotalAmount: 200,
            orderAddOn: [
              {
                orderAddonName: 'Dhai',
                orderAddOnId: 2,
                orderAddOnPrice: 10,
                quantity: 2,
                totalAddonPrice: 20,
              },
            ],
          },
        ],
      });
      orderService.sendRequestToDeliveryBoy = jest.fn();
      orderService.sendRequestToDeliveryBoy.mockResolvedValue([]);

      const spy = jest.spyOn(orderService, 'sendRequestToDeliveryBoy');

      const result = await orderService.updateConformation(
        'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
        '13ea43be-24f5-427e-8183-cb7afe1dcb0b',
        false,
      );

      expect(result).toBeInstanceOf(GetOrderDetailsRes);
      expect(spy).not.toBeCalled();
    });
  });

  describe('get Orders data', () => {

    it('get order by status', async () => {
      dataSource.manager.find.mockResolvedValue([
        {
          orderId: 'e7d42c5f-039c-42ed-9fe1-83df3d44ebb2',
          couponId: 15,
          restaurantId: 'a4147f02-91c4-45c4-97ff-be6f46006246',
          customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
          deliveryAgentId: '047ea9ea-1497-488f-8191-6dd88209fe25',
          deliveryAddress: '105, Bayad, 380059, Gujarat',
          subTotal: '720',
          sgst: '64.8',
          cgst: '64.8',
          totalAmount: '736.0299999999999',
          deliveryCharges: '66.42999999999999',
          deliveryAgentProfit: '59.78699999999999',
          resaturantProfit: '547.2',
          platformProfit: '-0.5570000000000164',
          prepareTime: '25',
          orderStatus: 'DELIVERED',
          discountedPrice: '540',
          isrestaurantAccepted: true,
          isDeliveryAccepted: true,
          deliveryRatings: null,
          deliveryRemarks: null,
          rejectionReason: null,
          deliveredOn: '2023-04-20T11:02:34.523Z',
          orderPlacedOn: '2023-04-20T10:59:07.339Z',
          addressLatitude: '23.04105',
          addressLongitude: '72.49552',
          ratingToCustomer: null,
          remarkToCustomer: null,
        },
      ]);

      dataSource.manager.find.mockResolvedValue([
        {
          orderId: 'e7d42c5f-039c-42ed-9fe1-83df3d44ebb2',
          orderStatus: 'DELIVERED',
          isrestaurantAccepted: true,
          isDeliveryAccepted: true,
          customer: {
            customerId: 'ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05',
            customerName: 'Pattu',
            customerPhone: '+911234567890',
          },
          orderItems: [
            {
              orderItemId: 184,
              itemName: 'Bhaji Pav',
              quantity: '5',
              itemTotalAmount: '720',
              orderAddOn: [
                {
                  orderAddOnId: 120,
                  orderAddonName: 'cachumber',
                  orderAddOnPrice: '20',
                  quantity: '4',
                  totalAddonPrice: '80',
                },
                {
                  orderAddOnId: 121,
                  orderAddonName: 'Lasan ni chatni',
                  orderAddOnPrice: '20',
                  quantity: '2',
                  totalAddonPrice: '40',
                },
              ],
            },
          ],
        },
      ]);

      let getData = await orderService.getOrders(
        '13ea43be-24f5-427e-8183-cb7afe1dcb0b',
        OrderStatus.ACCEPTED,
      );
      expect(getData).toBeInstanceOf(GetOrderDetailsRes);
    });

    it('get order not found', async () => {
      dataSource.manager.find.mockResolvedValue([])
      let getData = orderService.getOrders(
        '13ea43be-24f5-427e-8183-cb7afe1dcb0b',
        OrderStatus.ACCEPTED,
      );
      expect(getData).rejects.toThrow(
        new BadRequestException('Order Not Available In Your List'),
      );
    });
  });

});
