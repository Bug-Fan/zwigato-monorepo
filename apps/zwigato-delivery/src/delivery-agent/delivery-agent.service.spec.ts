import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryAgentService } from './delivery-agent.service';
import { DataSource } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { GeoCoddingService } from 'src/geoCodding.service';
import {
  BadGatewayException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DeliveryAgent } from 'src/db/entities/deliveryAgent.entity';
import { Order, OrderStatus } from 'src/db/entities/order.entity';
import { plainToInstance } from 'class-transformer';
import { FeedbackRatingReqDto } from './dto/request/feedbackRating.req.dto';
import { validate } from 'class-validator';
import { updateLocationRequestDto } from './dto/request/updatelocation.request.dto';
import { ActiveDeliveryAgentAccountReqDto } from './dto/request/activeDeliveryAgentAccount.req.dto';
import { PickedOrderReqDto } from './dto/request/pickedOrder.req.dto';
import { AcceptOrderReqDto } from './dto/request/acceptOrder.req.dto';
import { UpdateProfileReqDto } from './dto/request/updateProfile.req.dto';
// import { ValidationError } from 'class-validator';

//listorder
//activeAccount

describe('deliveryAgentService', () => {
  let deliveryAgentService: DeliveryAgentService;
  let dataSource;
  let jwtService;
  let feedbackRatingReqDto: FeedbackRatingReqDto;
  let updateProfileReqDto: UpdateProfileReqDto;

  beforeEach(async () => {
    feedbackRatingReqDto = new FeedbackRatingReqDto();
    updateProfileReqDto = new UpdateProfileReqDto();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryAgentService,
        {
          provide: 'DataSource',
          useValue: {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            release: jest.fn(),
            rollbackTransaction: jest.fn(),
            manager: {
              find: jest.fn(),
              findOneBy: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              rejects: jest.fn(),
              findOne: jest.fn(),
              create: jest.fn(),
              save: jest.fn(),
            },
          },
        },
        {
          provide: MailService,
          useValue: { verificationEmail: jest.fn() },
        },
        {
          provide: GeoCoddingService,
          useValue: {},
        },
      ],
    }).compile();

    deliveryAgentService =
      module.get<DeliveryAgentService>(DeliveryAgentService);
    dataSource = module.get<DataSource>('DataSource');
  });

  //list order
  let data = [
    {
      orderId: '85518bdb-5621-456a-b31a-d672e04901bc',
      deliveryAgentId: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c',
      order: {
        orderId: '85518bdb-5621-456a-b31a-d672e04901bc',
        restaurantId: 'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
        customerId: '5c687d95-73a2-40e1-8fb9-39c6cb61463b',
        deliveryAddress: '105, Bayad, 380059, Gujarat',
        subTotal: '155',
        sgst: '13.95',
        cgst: '13.95',
        totalAmount: '257.46',
        deliveryCharges: '74.56',
        deliveryAgentProfit: '67.104',
        resaturantProfit: '117.8',
        platformProfit: '44.656',
        orderStatus: 'PAID',
        discountedPrice: '80',
        isrestaurantAccepted: true,
        isDeliveryAccepted: false,
        orderPlacedOn: '2023-04-21T03:16:15.167Z',
        addressLatitude: '23.071443083114822',
        addressLongitude: '72.51682813915245',
        restaurant: {
          restaurantId: 'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
          restaurantName: 'Honest ',
          restaurantTypeId: 1,
          restaurantAddressLine1: 'Sola',
          restaurantAddressLine2: 'Sola',
          pincode: '380059',
          city: 'Ahmedabad',
          state: 'Gujrat',
          restaurantLatitude: '23.075677551310385',
          restaurantLongitude: '72.50896122072429',
          restaurantEmail: 'pintuthakarani10@gmail.com',
          restaurantPassword:
            '$2a$10$W9Wg7ufTn6/KSS/mLRCC2O3rHmwebE25J6P6Hm1TpNake6lgNBKmi',
          restaurantPhone: '6351884585',
          pancard: '212655465565',
          gstNumber: '123456789788',
          fssai: '32522355865',
          logoPath: '1681295842182-keval.png',
          bankName: '28823884242',
          bankIFSC: '424242424242',
          bankAccountNumber: '8978634561',
          isVerified: true,
          isActive: true,
          passBookImagePath: '1681295842212-keval.png',
          isEmailVerified: true,
          isDeleted: false,
          registerdAt: '2023-04-12T10:37:22.364Z',
        },
        customer: {
          customerId: '5c687d95-73a2-40e1-8fb9-39c6cb61463b',
          customerName: 'Patil;',
          customerEmail: 'parthitadara@gmail.com',
          customerPassword:
            '$2b$10$Oti0LIVDHOlBpMqU9L70uuQrlrVHeNrfaHaqH/QBAj/Qhy6f0vo4m',
          customerPhone: '+919081462631',
          profilePath:
            '2023-04-12T10-50-33.377Z- Screenshot from 2023-03-14 15-47-36.png',
          OTP: '231840',
          isEmailVerified: true,
          registerdAt: '2023-04-12T10:50:33.553Z',
          monthOrderValue: '257.46',
        },
        orderItems: [
          {
            orderItemId: 150,
            orderId: '85518bdb-5621-456a-b31a-d672e04901bc',
            itemId: '47',
            itemName: 'vadapav',
            quantity: '5',
            itemTotalAmount: '155',
            itemPrice: '15',
            orderAddOn: [
              {
                orderAddOnId: 89,
                orderItemId: 150,
                orderAddonName: 'Tikhi chatni',
                orderAddOnPrice: '20',
                quantity: '4',
                totalAddonPrice: '80',
              },
            ],
          },
        ],
      },
    },
  ];
  it('list order when the order is available', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';

    dataSource.manager.find.mockResolvedValue(data);

    expect(await deliveryAgentService.listOrder(uuid)).toEqual({
      status: true,
      msg: 'List Of Order',
      data: [
        {
          orderId: '85518bdb-5621-456a-b31a-d672e04901bc',
          restaurantName: 'Honest ',
          restaurantAddressLine1: 'Sola',
          restaurantAddressLine2: 'Sola',
          pincode: '380059',
          city: 'Ahmedabad',
          restaurantLatitude: '23.075677551310385',
          restaurantLongitude: '72.50896122072429',
          phone: '6351884585',
          customerDetails: {
            customerName: 'Patil;',
            deliveryAddress: '105, Bayad, 380059, Gujarat',
            addressLatitude: '23.071443083114822',
            addressLongitude: '72.51682813915245',
          },
          orderItems: [
            {
              orderAddon: [
                {
                  menuAddOnId: 89,
                  addOnName: 'Tikhi chatni',
                  addonPrice: '20',
                  quantity: '4',
                  totalAddonPrice: '80',
                },
              ],
              itemName: 'vadapav',
              quantity: '5',
              itemPrice: '15',
              itemTotalAmount: '155',
            },
          ],
        },
      ],
    });
  });

  it('listOrder when the order is not found', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';
    dataSource.manager.find.mockResolvedValue();

    expect(deliveryAgentService.listOrder(uuid)).rejects.toThrow(
      new NotFoundException('Order is not found'),
    );
  });

  it('listOrder when the order is bad exception', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';
    dataSource.manager.find.mockResolvedValue();

    expect(deliveryAgentService.listOrder(uuid)).rejects.toThrow(
      new BadRequestException('Order is not found'),
    );
  });

  // list order by status
  it('list order by status when order is available', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';
    let status: OrderStatus.ACCEPTED;
    dataSource.manager.find.mockResolvedValue(data);

    expect(await deliveryAgentService.listOrderByStatus(uuid, status)).toEqual({
      status: true,
      msg: 'List Of Order',
      data: [
        {
          orderId: '85518bdb-5621-456a-b31a-d672e04901bc',
          restaurantName: 'Honest ',
          restaurantAddressLine1: 'Sola',
          restaurantAddressLine2: 'Sola',
          pincode: '380059',
          city: 'Ahmedabad',
          restaurantLatitude: '23.075677551310385',
          restaurantLongitude: '72.50896122072429',
          phone: '6351884585',
          customerDetails: {
            customerName: 'Patil;',
            deliveryAddress: '105, Bayad, 380059, Gujarat',
            addressLatitude: '23.071443083114822',
            addressLongitude: '72.51682813915245',
          },
          orderItems: [
            {
              orderAddon: [
                {
                  menuAddOnId: 89,
                  addOnName: 'Tikhi chatni',
                  addonPrice: '20',
                  quantity: '4',
                  totalAddonPrice: '80',
                },
              ],
              itemName: 'vadapav',
              quantity: '5',
              itemPrice: '15',
              itemTotalAmount: '155',
            },
          ],
        },
      ],
    });
  });

  it('list order by status not found', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';
    dataSource.manager.find.mockResolvedValue();
    expect(
      deliveryAgentService.listOrderByStatus(uuid, OrderStatus.DISPATCHED),
    ).rejects.toThrow(new NotFoundException('Order is not found'));
  });

  //activeAccount

  it('active Account when the user goes online', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';
    let data = { activeStatus: true };
    dataSource.manager.findOneBy.mockResolvedValue(data);
    dataSource.manager.update.mockResolvedValue(
      DeliveryAgent,
      {
        agentId: uuid,
      },
      { isActive: false },
    );
    expect(await deliveryAgentService.activeAccount(data, uuid)).toEqual({
      msg: 'You are now online',
      status: true,
    });
  });

  it('active Account when the user goes offline', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';

    let data = {
      activeStatus: false,
    };
    dataSource.manager.findOneBy.mockResolvedValue({ isActive: true });
    dataSource.manager.update.mockResolvedValue(
      DeliveryAgent,
      {
        agentId: uuid,
      },
      { isActive: false },
    );

    expect(await deliveryAgentService.activeAccount(data, uuid)).toEqual({
      status: true,
      msg: 'You are now offline',
    });
  });

  it('active Account the data can not be mock', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';

    let data = {
      activeStatus: true,
    };
    dataSource.manager.findOneBy.mockResolvedValue();
    dataSource.manager.update.mockResolvedValue();

    expect(deliveryAgentService.activeAccount(data, uuid)).rejects.toThrow(
      new NotFoundException(
        'User is not found!! Otherwise user is not verified!',
      ),
    );
  });

  it('active Account give the bad Request', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';

    let data;

    expect(deliveryAgentService.activeAccount(data, uuid)).rejects.toThrow(
      new BadRequestException('something went wrong'),
    );
  });

  //delete account

  it('delete account', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';
    let data = true;
    dataSource.manager.findOneBy.mockResolvedValue(data);
    dataSource.manager.update.mockResolvedValue(
      {
        agentId: uuid,
      },
      { isDeleted: false, isActive: false },
    );

    expect(await deliveryAgentService.deleteAccount(true, uuid)).toEqual({
      status: true,
      msg: 'User Deleted Successfully',
    });
  });

  it('delete account user not found', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';

    dataSource.manager.findOneBy.mockResolvedValue();
    dataSource.manager.update.mockResolvedValue();

    expect(deliveryAgentService.deleteAccount(true, uuid)).rejects.toThrow(
      new NotFoundException(
        'User is not found!! Otherwise user is not verified!',
      ),
    );
  });

  //accept Order
  it('acceptOrder', async () => {
    let uuid: '85518bdb-5621-456a-b31a-d672e04901bc';
    let delivertAgentd: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';

    dataSource.manager.find.mockResolvedValue([
      { deliveryAgentId: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c' },
    ]);

    dataSource.manager.update.mockResolvedValue({
      generatedMaps: [],
      raw: [],
      affected: 1,
    });

    dataSource.manager.update.mockResolvedValue({
      generatedMaps: [],
      raw: [],
      affected: 1,
    });

    dataSource.manager.findOne.mockResolvedValue({
      orderId: '85518bdb-5621-456a-b31a-d672e04901bc',
      restaurantId: 'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
      customerId: '5c687d95-73a2-40e1-8fb9-39c6cb61463b',
      deliveryAgentId: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c',
      deliveryAddress: '105, Bayad, 380059, Gujarat',
      subTotal: '155',
      sgst: '13.95',
      cgst: '13.95',
      totalAmount: '257.46',
      deliveryCharges: '74.56',
      deliveryAgentProfit: '67.104',
      resaturantProfit: '117.8',
      platformProfit: '44.656',
      orderStatus: 'ACCEPTED',
      discountedPrice: '80',
      isrestaurantAccepted: true,
      isDeliveryAccepted: true,
      orderPlacedOn: '2023-04-21T03:16:15.167Z',
      addressLatitude: '23.071443083114822',
      addressLongitude: '72.51682813915245',
      restaurant: {
        restaurantName: 'Honest ',
        restaurantAddressLine1: 'Sola',
        restaurantAddressLine2: 'Sola',
        pincode: '380059',
        city: 'Ahmedabad',
        restaurantEmail: 'pintuthakarani10@gmail.com',
        restaurantPhone: '6351884585',
      },
      customer: {
        customerName: 'Patil;',
        customerEmail: 'parthitadara@gmail.com',
        customerPhone: '+919081462631',
      },
      deliveryAgent: { agentName: 'parth', agentPhone: '9638613178' },
      orderItems: [
        {
          orderItemId: 150,
          orderId: '85518bdb-5621-456a-b31a-d672e04901bc',
          itemId: '47',
          itemName: 'vadapav',
          quantity: '5',
          itemTotalAmount: '155',
          itemPrice: '15',
          orderAddOn: [
            {
              orderAddOnId: 89,
              orderItemId: 150,
              orderAddonName: 'Tikhi chatni',
              orderAddOnPrice: '20',
              quantity: '4',
              totalAddonPrice: '80',
            },
          ],
        },
      ],
    });

    dataSource.manager.delete.mockResolvedValue({ raw: [], affected: 1 });

    let usedCoupons = dataSource.manager.create({
      customerId: '5c687d95-73a2-40e1-8fb9-39c6cb61463b',
      couponId: '3',
    });

    dataSource.manager.save.mockResolvedValue({
      usedCoupons,
    });

    expect(
      await deliveryAgentService.acceptOrder(uuid, delivertAgentd),
    ).toEqual({
      status: true,
      msg: 'Order is Accepted',
      data: {
        orderItems: [
          {
            orderAddon: [
              {
                menuAddOnId: 89,
                addOnName: 'Tikhi chatni',
                addonPrice: '20',
                quantity: '4',
                totalAddonPrice: '80',
              },
            ],
            itemName: 'vadapav',
            quantity: '5',
            itemPrice: '15',
            itemTotalAmount: '155',
          },
        ],
        restaurant_Details: {
          restaurantName: 'Honest ',
          restaurantAddressLine1: 'Sola',
          restaurantAddressLine2: 'Sola',
          pincode: '380059',
          city: 'Ahmedabad',
          restaurantEmail: 'pintuthakarani10@gmail.com',
          restaurantPhone: '6351884585',
        },
        customer_Details: {
          customerName: 'Patil;',
          customerEmail: 'parthitadara@gmail.com',
          customerPhone: '+919081462631',
        },
        customerAddressDetails: {
          custmerAddress: '105, Bayad, 380059, Gujarat',
          customerLat: '23.071443083114822',
          custmerLon: '72.51682813915245',
        },
      },
    });
  });

  it('acceptOrder notfound', async () => {
    let uuid: '85518bdb-5621-456a-b31a-d672e04901bc';
    let delivertAgentd: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';

    dataSource.manager.find.mockResolvedValue([
      { deliveryAgentId: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c' },
    ]);

    dataSource.manager.update.mockResolvedValue({
      generatedMaps: [],
      raw: [],
      affected: 1,
    });

    dataSource.manager.findOne.mockResolvedValue();

    dataSource.manager.delete.mockResolvedValue();

    dataSource.manager.create.mockResolvedValue();

    dataSource.manager.save.mockResolvedValue();

    expect(
      deliveryAgentService.acceptOrder(uuid, delivertAgentd),
    ).rejects.toThrow(new BadRequestException('Something went wrong'));
  });

  //picked order perfect testCases
  it('picked order', async () => {
    let uuid: '85518bdb-5621-456a-b31a-d672e04901bc';

    dataSource.manager.update.mockResolvedValue({
      generatedMaps: [],
      raw: [],
      affected: 1,
    });

    dataSource.manager.findOne.mockResolvedValue({
      orderId: '85518bdb-5621-456a-b31a-d672e04901bc',
      couponId: 3,
      restaurantId: 'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
      customerId: '5c687d95-73a2-40e1-8fb9-39c6cb61463b',
      deliveryAgentId: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c',
      deliveryAddress: '105, Bayad, 380059, Gujarat',
      subTotal: '155',
      sgst: '13.95',
      cgst: '13.95',
      totalAmount: '257.46',
      deliveryCharges: '74.56',
      deliveryAgentProfit: '67.104',
      resaturantProfit: '117.8',
      platformProfit: '44.656',
      orderStatus: 'DISPATCHED',
      discountedPrice: '80',
      isrestaurantAccepted: true,
      isDeliveryAccepted: true,
      orderPlacedOn: '2023-04-21T03:16:15.167Z',
      addressLatitude: '23.071443083114822',
      addressLongitude: '72.51682813915245',
      restaurant: {
        restaurantName: 'Honest ',
        restaurantAddressLine1: 'Sola',
        restaurantAddressLine2: 'Sola',
        pincode: '380059',
        city: 'Ahmedabad',
        restaurantPhone: '6351884585',
      },
      customer: {
        customerName: 'Patil;',
        customerEmail: 'parthitadara@gmail.com',
        customerPhone: '+919081462631',
      },
      deliveryAgent: { agentName: 'parth', agentPhone: '9638613178' },
      orderItems: [
        {
          orderItemId: 150,
          orderId: '85518bdb-5621-456a-b31a-d672e04901bc',
          itemId: '47',
          itemName: 'vadapav',
          quantity: '5',
          itemTotalAmount: '155',
          itemPrice: '15',
          orderAddOn: [
            {
              orderAddOnId: 89,
              orderItemId: 150,
              orderAddonName: 'Tikhi chatni',
              orderAddOnPrice: '20',
              quantity: '4',
              totalAddonPrice: '80',
            },
          ],
        },
      ],
    });
    expect(
      await deliveryAgentService.pickedOrder(
        uuid,
        OrderStatus.DISPATCHED,
        'Order Picked Successfully',
      ),
    ).toEqual({
      status: true,
      msg: 'Order Picked Successfully',
      data: {
        orderItems: [
          {
            orderAddon: [
              {
                menuAddOnId: 89,
                addOnName: 'Tikhi chatni',
                addonPrice: '20',
                quantity: '4',
                totalAddonPrice: '80',
              },
            ],
            itemName: 'vadapav',
            quantity: '5',
            itemPrice: '15',
            itemTotalAmount: '155',
          },
        ],
        restaurant_Details: {
          restaurantName: 'Honest ',
          restaurantAddressLine1: 'Sola',
          restaurantAddressLine2: 'Sola',
          pincode: '380059',
          city: 'Ahmedabad',
          restaurantPhone: '6351884585',
        },
        customer_Details: {
          customerName: 'Patil;',
          customerEmail: 'parthitadara@gmail.com',
          customerPhone: '+919081462631',
        },
        customerAddressDetails: {
          custmerAddress: '105, Bayad, 380059, Gujarat',
          customerLat: '23.071443083114822',
          custmerLon: '72.51682813915245',
        },
      },
    });
  });

  it('picked order not get orderData', async () => {
    let uuid: '85518bdb-5621-456a-b31a-d672e04901bc';

    dataSource.manager.update.mockResolvedValue({
      generatedMaps: [],
      raw: [],
      affected: 0,
    });

    dataSource.manager.findOne.mockResolvedValue();
    expect(
      deliveryAgentService.pickedOrder(
        uuid,
        OrderStatus.DISPATCHED,
        'Order Picked Successfully',
      ),
    ).rejects.toThrow(new NotFoundException('Order is not found'));
  });

  it('picked order not get update bad request', async () => {
    let uuid: '85518bdb-5621-456a-b31a-d672e04901bc';

    dataSource.manager.update.mockResolvedValue();

    dataSource.manager.findOne.mockResolvedValue();
    expect(
      deliveryAgentService.pickedOrder(
        uuid,
        OrderStatus.DISPATCHED,
        'Order Picked Successfully',
      ),
    ).rejects.toThrow(new BadRequestException('something went wrong'));
  });

  it('deliverOrder', async () => {
    let uuid: '85518bdb-5621-456a-b31a-d672e04901bc';
    let delivertAgentd: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';

    dataSource.manager.findOne.mockResolvedValue({
      orderId: '85518bdb-5621-456a-b31a-d672e04901bc',
      couponId: 3,
      restaurantId: 'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
      customerId: '5c687d95-73a2-40e1-8fb9-39c6cb61463b',
      deliveryAgentId: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c',
      deliveryAddress: '105, Bayad, 380059, Gujarat',
      subTotal: '155',
      sgst: '13.95',
      cgst: '13.95',
      totalAmount: '257.46',
      deliveryCharges: '74.56',
      deliveryAgentProfit: '67.104',
      resaturantProfit: '117.8',
      platformProfit: '44.656',
      orderStatus: 'ARRIVED',
      discountedPrice: '80',
      isrestaurantAccepted: true,
      isDeliveryAccepted: true,
      orderPlacedOn: '2023-04-21T03:16:15.167Z',
      addressLatitude: '23.071443083114822',
      addressLongitude: '72.51682813915245',
      customer: {
        customerId: '5c687d95-73a2-40e1-8fb9-39c6cb61463b',
        customerName: 'Patil;',
        customerEmail: 'parthitadara@gmail.com',
        customerPassword:
          '$2b$10$Oti0LIVDHOlBpMqU9L70uuQrlrVHeNrfaHaqH/QBAj/Qhy6f0vo4m',
        customerPhone: '+919081462631',
        profilePath:
          '2023-04-12T10-50-33.377Z- Screenshot from 2023-03-14 15-47-36.png',
        OTP: '231840',
        isEmailVerified: true,
        registerdAt: '2023-04-12T10:50:33.553Z',
        monthOrderValue: '257.46',
      },
      restaurant: {
        restaurantId: 'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
        restaurantName: 'Honest ',
        restaurantTypeId: 1,
        restaurantAddressLine1: 'Sola',
        restaurantAddressLine2: 'Sola',
        pincode: '380059',
        city: 'Ahmedabad',
        state: 'Gujrat',
        restaurantLatitude: '23.075677551310385',
        restaurantLongitude: '72.50896122072429',
        restaurantEmail: 'pintuthakarani10@gmail.com',
        restaurantPassword:
          '$2a$10$W9Wg7ufTn6/KSS/mLRCC2O3rHmwebE25J6P6Hm1TpNake6lgNBKmi',
        restaurantPhone: '6351884585',
        pancard: '212655465565',
        gstNumber: '123456789788',
        fssai: '32522355865',
        logoPath: '1681295842182-keval.png',
        bankName: '28823884242',
        bankIFSC: '424242424242',
        bankAccountNumber: '8978634561',
        isVerified: true,
        isActive: true,
        passBookImagePath: '1681295842212-keval.png',
        isEmailVerified: true,
        isDeleted: false,
        registerdAt: '2023-04-12T10:37:22.364Z',
      },
    });

    dataSource.manager.find.mockResolvedValue([
      {
        itemName: 'vadapav',
        quantity: '5',
        itemTotalAmount: '155',
        itemPrice: '15',
        orderAddOn: [
          {
            orderAddOnId: 89,
            orderItemId: 150,
            orderAddonName: 'Tikhi chatni',
            orderAddOnPrice: '20',
            quantity: '4',
            totalAddonPrice: '80',
          },
        ],
      },
    ]);

    expect(
      await deliveryAgentService.deliverOrder(
        uuid,
        OrderStatus.DELIVERED,
        delivertAgentd,
        'Order Delivered Successfully',
      ),
    ).toMatchObject({
      status: true,
      msg: 'Order Delivered Successfully',
      data: {
        orderInvoice: {
          orderId: '85518bdb-5621-456a-b31a-d672e04901bc',
          cutomerName: 'Patil;',
          customerAddress: '105, Bayad, 380059, Gujarat',
          subTotal: '155',
          sgst: '13.95',
          cgst: '13.95',
          deliveyCharges: '74.56',
          totalAmount: '257.46',
        },
        orderDetails: [
          {
            orderItem: {
              orderItem: [
                {
                  itemName: 'vadapav',
                  quantity: '5',
                  itemTotalAmount: '155',
                  itemPrice: '15',
                  orderAddOn: [
                    {
                      orderAddOnId: 89,
                      orderItemId: 150,
                      orderAddonName: 'Tikhi chatni',
                      orderAddOnPrice: '20',
                      quantity: '4',
                      totalAddonPrice: '80',
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    });
  });

  it('deliver order not get orderData', async () => {
    let uuid: '85518bdb-5621-456a-b31a-d672e04901bc';
    let delivertAgentd: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';

    dataSource.manager.findOne.mockResolvedValue();

    dataSource.manager.find.mockResolvedValue();

    expect(
      deliveryAgentService.deliverOrder(
        uuid,
        OrderStatus.DELIVERED,
        delivertAgentd,
        'Order Delivered Successfully',
      ),
    ).rejects.toThrow(new NotFoundException('Order is not found'));
  });

  it('reach Drop Location', async () => {
    let uuid: '85518bdb-5621-456a-b31a-d672e04901bc';

    dataSource.manager.findOne.mockResolvedValue({
      orderId: '85518bdb-5621-456a-b31a-d672e04901bc',
      couponId: 3,
      restaurantId: 'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
      customerId: '5c687d95-73a2-40e1-8fb9-39c6cb61463b',
      deliveryAgentId: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c',
      deliveryAddress: '105, Bayad, 380059, Gujarat',
      subTotal: '155',
      sgst: '13.95',
      cgst: '13.95',
      totalAmount: '257.46',
      deliveryCharges: '74.56',
      deliveryAgentProfit: '67.104',
      resaturantProfit: '117.8',
      platformProfit: '44.656',
      prepareTime: null,
      orderStatus: 'DISPATCHED',
      discountedPrice: '80',
      isrestaurantAccepted: true,
      isDeliveryAccepted: true,
      deliveryRatings: null,
      deliveryRemarks: null,
      rejectionReason: null,
      deliveredOn: '2023-04-27T06:31:25.670Z',
      orderPlacedOn: '2023-04-21T03:16:15.167Z',
      addressLatitude: '23.071443083114822',
      addressLongitude: '72.51682813915245',
      ratingToCustomer: null,
      remarkToCustomer: null,
      customer: {
        customerId: '5c687d95-73a2-40e1-8fb9-39c6cb61463b',
        customerName: 'Patil;',
        customerEmail: 'parthitadara@gmail.com',
        customerPassword:
          '$2b$10$Oti0LIVDHOlBpMqU9L70uuQrlrVHeNrfaHaqH/QBAj/Qhy6f0vo4m',
        customerPhone: '+919081462631',
        profilePath:
          '2023-04-12T10-50-33.377Z- Screenshot from 2023-03-14 15-47-36.png',
        OTP: '231840',
        isEmailVerified: true,
        registerdAt: '2023-04-12T10:50:33.553Z',
        monthOrderValue: '257.46',
      },
    });

    expect(await deliveryAgentService.reachDropLocation(uuid)).toEqual({
      status: true,
      msg: 'Your Order is drop on your location, Please collect your order',
      data: {
        mobile: '+919081462631',
      },
    });
  });

  it('reach Drop Location not found order', async () => {
    let uuid: '85518bdb-5621-456a-b31a-d672e04901bc';

    dataSource.manager.findOne.mockResolvedValue();

    expect(deliveryAgentService.reachDropLocation(uuid)).rejects.toThrow(
      new NotFoundException('Order is not found'),
    );
  });

  it('feedback rating', async () => {
    let uuid: '85518bdb-5621-456a-b31a-d672e04901bc';

    let feedbackRating = {
      rating: 8,
      remark: 'better',
    };

    dataSource.manager.findOne.mockResolvedValue({
      orderId: '85518bdb-5621-456a-b31a-d672e04901bc',
      couponId: 3,
      restaurantId: 'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
      customerId: '5c687d95-73a2-40e1-8fb9-39c6cb61463b',
      deliveryAgentId: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c',
      deliveryAddress: '105, Bayad, 380059, Gujarat',
      subTotal: '155',
      sgst: '13.95',
      cgst: '13.95',
      totalAmount: '257.46',
      deliveryCharges: '74.56',
      deliveryAgentProfit: '67.104',
      resaturantProfit: '117.8',
      platformProfit: '44.656',
      prepareTime: null,
      orderStatus: 'DELIVERED',
      discountedPrice: '80',
      isrestaurantAccepted: true,
      isDeliveryAccepted: true,
      deliveredOn: '2023-04-25T08:59:19.017Z',
      orderPlacedOn: '2023-04-21T03:16:15.167Z',
      addressLatitude: '23.071443083114822',
      addressLongitude: '72.51682813915245',
    });

    expect(
      await deliveryAgentService.feedbackRating(uuid, feedbackRating),
    ).toEqual({
      status: true,
      msg: 'Thank you for your feedback!',
    });
  });

  it('feedback rarimg not get orderData', async () => {
    let uuid: '85518bdb-5621-456a-b31a-d672e04901bc';

    let feedbackRating = {
      rating: 5,
      remark: 'better',
    };

    dataSource.manager.findOne.mockResolvedValue();

    expect(
      deliveryAgentService.feedbackRating(uuid, feedbackRating),
    ).rejects.toThrow(new NotFoundException('Order is not found'));
  });

  it('should give average data', async () => {
    let uuid: '85518bdb-5621-456a-b31a-d672e04901bc';
    dataSource.manager.find.mockResolvedValue([
      {
        orderId: '85518bdb-5621-456a-b31a-d672e04901bc',
        couponId: 3,
        restaurantId: 'db76db71-742e-4fbb-9273-a2aa4dff3dfe',
        customerId: '5c687d95-73a2-40e1-8fb9-39c6cb61463b',
        deliveryAgentId: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c',
        deliveryAddress: '105, Bayad, 380059, Gujarat',
        subTotal: '155',
        sgst: '13.95',
        cgst: '13.95',
        totalAmount: '257.46',
        deliveryCharges: '74.56',
        deliveryAgentProfit: '67.104',
        resaturantProfit: '117.8',
        platformProfit: '44.656',
        prepareTime: null,
        orderStatus: 'DELIVERED',
        discountedPrice: '80',
        isrestaurantAccepted: true,
        isDeliveryAccepted: true,
        deliveryRatings: null,
        deliveryRemarks: null,
        rejectionReason: null,
        deliveredOn: '2023-04-27T08:34:57.118Z',
        orderPlacedOn: '2023-04-21T03:16:15.167Z',
        addressLatitude: '23.071443083114822',
        addressLongitude: '72.51682813915245',
        ratingToCustomer: null,
        remarkToCustomer: null,
      },
    ]);
    expect(await deliveryAgentService.findAvgRating(uuid)).toEqual({
      status: true,
      msg: 'This is you average rating',
      data: 0,
    });
  });

  it('should not give average data bad request', async () => {
    let uuid: '85518bdb-5621-456a-b31a-d672e04901bc';
    dataSource.manager.find.mockResolvedValue();
    expect(deliveryAgentService.findAvgRating(uuid)).rejects.toThrow(
      new NotFoundException('Order is not found'),
    );
  });

  it('should give error trip earning report', async () => {
    let uuid: '85518bdb-5621-456a-b31a-d672e04901bc';
    dataSource.manager.find.mockResolvedValue();
    expect(deliveryAgentService.tripReport(uuid)).rejects.toThrow(
      new BadRequestException('not found'),
    );
  });

  it('should update location', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';
    let status = {
      agentLatitude: 12.343,
      agentLongitude: 23.434,
    };
    dataSource.manager.findOneBy.mockResolvedValue({
      agentId: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c',
      agentName: 'parth',
      agentEmail: 'parthitadara@gmail.com',
      agentPassword:
        '$2a$10$2C5MxcAMmUrkRmS73xgndeINs9aWLP1aBaV4O8nn2t3TP01FH57Lq',
      agentProfilePath: '1681797138327-IMG_20201213_073054.jpg',
      agentAddressLine1: 'Saral heights',
      agentAddressLine2: 'gatlodiya',
      pincode: '380061',
      city: 'Ahmedabad',
      state: 'gujarat',
      agentLatitude: '20.23',
      agentLongitude: '34.22',
      agentPhone: '9512449798',
      managerId: null,
      adharcardImagePath: '1681797138323-IMG_20201215_070047.jpg',
      licenceImagePath: '1681797138326-IMG_20201215_065845.jpg',
      adharcardNumber: '747474747474',
      licenceNumber: 'gj019383731',
      vehicaleNumber: 'gj27bp1233',
      agentRCBookImagePath: '1681797138328-IMG_20201215_070047.jpg',
      passBookImagePath: '1681797138329-IMG_20201215_065845.jpg',
      bankName: 'icici',
      bankIFSC: 'bkic01023300',
      bankAccountNumber: '2011233433',
      isVerified: true,
      isActive: true,
      isFree: true,
      isDeposited: true,
      OTP: '96708',
      isEmailVerified: true,
      isDeleted: false,
      jobType: 'FULL_TIME',
      tshirtSize: 'S',
      registerdAt: '2023-04-18T05:52:18.357Z',
      joinedDate: '2023-04-18T05:52:18.408Z',
      firstOrderDate: '2023-04-27T08:34:57.135Z',
    });
    dataSource.manager.update.mockResolvedValue({
      generatedMaps: [],
      raw: [],
      affected: 1,
    });
    expect(await deliveryAgentService.updateLocation(uuid, status)).toEqual({
      status: true,
      msg: 'location updated Successfully',
    });
  });

  it('should  not update location', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';
    let status = {
      agentLatitude: 12.343,
      agentLongitude: 23.434,
    };
    dataSource.manager.findOneBy.mockResolvedValue();
    dataSource.manager.update.mockResolvedValue({
      generatedMaps: [],
      raw: [],
      affected: 1,
    });
    expect(deliveryAgentService.updateLocation(uuid, status)).rejects.toThrow(
      new NotFoundException('not update'),
    );
  });

  it('should be update deliverAgentProfile', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';
    let imgArr = [];
    let data = { agentPhone: '9512449697' };

    dataSource.manager.findOneBy.mockResolvedValue({
      agentId: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c',
      agentName: 'parth',
      agentEmail: 'parthitadara@gmail.com',
      agentPassword:
        '$2a$10$2C5MxcAMmUrkRmS73xgndeINs9aWLP1aBaV4O8nn2t3TP01FH57Lq',
      agentProfilePath: '1681797138327-IMG_20201213_073054.jpg',
      agentAddressLine1: 'Saral heights',
      agentAddressLine2: 'gatlodiya',
      pincode: '380061',
      city: 'Ahmedabad',
      state: 'gujarat',
      agentLatitude: '20.23',
      agentLongitude: '34.22',
      agentPhone: '9512449798',
      managerId: null,
      adharcardImagePath: '1681797138323-IMG_20201215_070047.jpg',
      licenceImagePath: '1681797138326-IMG_20201215_065845.jpg',
      adharcardNumber: '747474747474',
      licenceNumber: 'gj019383731',
      vehicaleNumber: 'gj27bp1233',
      agentRCBookImagePath: '1681797138328-IMG_20201215_070047.jpg',
      passBookImagePath: '1681797138329-IMG_20201215_065845.jpg',
      bankName: 'icici',
      bankIFSC: 'bkic01023300',
      bankAccountNumber: '2011233433',
      isVerified: true,
      isActive: true,
      isFree: true,
      isDeposited: true,
      OTP: '96708',
      isEmailVerified: true,
      isDeleted: false,
      jobType: 'FULL_TIME',
      tshirtSize: 'S',
      registerdAt: '2023-04-18T05:52:18.357Z',
      joinedDate: '2023-04-18T05:52:18.408Z',
      firstOrderDate: '2023-04-27T08:34:57.135Z',
    });

    expect(
      await deliveryAgentService.updateProfile(data, imgArr, uuid),
    ).toEqual({
      status: true,
      msg: 'Data Update Successfully',
    });
  });

  it('should not be update deliverAgentProfile', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';
    let imgArr = [];

    let data = { agentPhone: '9512449697' };

    dataSource.manager.findOneBy.mockResolvedValue();

    expect(
      deliveryAgentService.updateProfile(data, imgArr, uuid),
    ).rejects.toThrow(
      new NotFoundException(
        'User is not found!! Otherwise user is not verified!',
      ),
    );
  });

  it('should be Images is provided', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';
    let imgArr = [
      {
        fieldname: 'rcBookImagePath',
        originalname: 'IMG_20201215_065845.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: './uploads',
        filename: '1682664023228-IMG_20201215_065845.jpg',
        path: 'uploads\\1682664023228-IMG_20201215_065845.jpg',
        size: 116502,
      },
      {
        fieldname: 'passBookImagePath',
        originalname: 'IMG_20201215_065845.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: './uploads',
        filename: '1682664023229-IMG_20201215_065845.jpg',
        path: 'uploads\\1682664023229-IMG_20201215_065845.jpg',
        size: 116502,
      },
      {
        fieldname: 'agentProfilePath',
        originalname: 'IMG_20201215_065845.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: './uploads',
        filename: '1682664023231-IMG_20201215_065845.jpg',
        path: 'uploads\\1682664023231-IMG_20201215_065845.jpg',
        size: 116502,
      },
    ];

    const rcBookImagePath = imgArr.find(
      (o) => o.fieldname == 'rcBookImagePath',
    );

    const passBookImagePath = imgArr.find(
      (o) => o.fieldname == 'passBookImagePath',
    );

    const agentProfilePath = imgArr.find(
      (o) => o.fieldname == 'agentProfilePath',
    );

    expect(rcBookImagePath).toEqual({
      fieldname: 'rcBookImagePath',
      originalname: 'IMG_20201215_065845.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './uploads',
      filename: '1682664023228-IMG_20201215_065845.jpg',
      path: 'uploads\\1682664023228-IMG_20201215_065845.jpg',
      size: 116502,
    });
    expect(passBookImagePath).toEqual({
      fieldname: 'passBookImagePath',
      originalname: 'IMG_20201215_065845.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './uploads',
      filename: '1682664023229-IMG_20201215_065845.jpg',
      path: 'uploads\\1682664023229-IMG_20201215_065845.jpg',
      size: 116502,
    });
    expect(agentProfilePath).toEqual({
      fieldname: 'agentProfilePath',
      originalname: 'IMG_20201215_065845.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './uploads',
      filename: '1682664023231-IMG_20201215_065845.jpg',
      path: 'uploads\\1682664023231-IMG_20201215_065845.jpg',
      size: 116502,
    });
  });

  it('should be give badRequest updateProfile', async () => {
    let uuid: '04a4e5dd-7e7b-4305-b01d-66c4d5a62a9c';
    let imgArr;

    let data;

    expect(
      deliveryAgentService.updateProfile(data, imgArr, uuid),
    ).rejects.toThrow(new BadRequestException('something went wrong'));
  });

  it('validate feedback rating dto', async () => {
    let feedbackRating = {
      rating: -3,
      remark: 3,
    };
    const ofImportDto = plainToInstance(FeedbackRatingReqDto, feedbackRating);
    const error = await validate(ofImportDto);
    expect(error[0].constraints.isPositive).toContain(
      `rating must be a positive number`,
    );
    expect(error[1].constraints.isString).toContain('remark must be a string');
  });

  it('validate update location rating dto', async () => {
    let location = {
      agentLongitude: [],
    };
    const ofImportDto = plainToInstance(updateLocationRequestDto, location);
    const error = await validate(ofImportDto);
    expect(error[0].constraints.isLatitude).toContain(
      'agentLatitude must be a latitude string or number',
    );
    expect(error[1].constraints.isLongitude).toContain(
      'agentLongitude must be a longitude string or number',
    );
  });

  it('validate active agent request dto', async () => {
    let status = {
      activeStatus: 1,
    };
    const ofImportDto = plainToInstance(
      ActiveDeliveryAgentAccountReqDto,
      status,
    );
    const error = await validate(ofImportDto);
    expect(error[0].constraints.isBoolean).toContain(
      'activeStatus must be a boolean value',
    );
  });

  it('validate picked order request dto', async () => {
    let status = {
      pickOrderStatus: 1,
    };
    const ofImportDto = plainToInstance(PickedOrderReqDto, status);
    const error = await validate(ofImportDto);
    expect(error[0].constraints.isBoolean).toContain(
      'pickOrderStatus must be a boolean value',
    );
  });

  it('validate accept order request dto', async () => {
    let status = {
      acceptStatus: 1,
    };
    const ofImportDto = plainToInstance(AcceptOrderReqDto, status);
    const error = await validate(ofImportDto);
    expect(error[0].constraints.isBoolean).toContain(
      'acceptStatus must be a boolean value',
    );
  });

  describe('UpdateProfileReqDto', () => {
    let updateProfileReqDto: UpdateProfileReqDto;

    beforeEach(() => {
      updateProfileReqDto = new UpdateProfileReqDto();
    });

    it('should be defined', () => {
      expect(updateProfileReqDto).toBeDefined();
    });

    it('agentAddressLine1 should not be string', async () => {
      let updateProfileData = {
        agentAddressLine1: 45,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);
      expect(error[0].constraints.isString).toContain(
        'agentAddressLine1 must be a string',
      );
    });

    it('agentAddressLine2 should not be string', async () => {
      let updateProfileData = {
        agentAddressLine2: 5,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isString).toContain(
        'agentAddressLine2 must be a string',
      );
    });

    it('pincode', async () => {
      let updateProfileData = {
        pincode: 5,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isString).toContain(
        'pincode must be a string',
      );
    });

    it('city', async () => {
      let updateProfileData = {
        city: 5,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isString).toContain('city must be a string');
    });

    it('state', async () => {
      let updateProfileData = {
        state: 5,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isString).toContain('state must be a string');
    });

    it('agentLatitude', async () => {
      let updateProfileData = {
        agentLatitude: 5,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isString).toContain(
        'agentLatitude must be a string',
      );
    });

    it('agentLongitude', async () => {
      let updateProfileData = {
        agentLongitude: 5,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isString).toContain(
        'agentLongitude must be a string',
      );
    });

    it('agentPhone', async () => {
      let updateProfileData = {
        agentPhone: 5,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isString).toContain(
        'agentPhone must be a string',
      );
    });

    it('agentProfilePath', async () => {
      let updateProfileData = {
        agentProfilePath: 5,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isString).toContain(
        'agentProfilePath must be a string',
      );
    });

    it('vehicleNumber', async () => {
      let updateProfileData = {
        vehicleNumber: 5,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isString).toContain(
        'vehicleNumber must be a string',
      );
    });

    it('rcBookImagePath', async () => {
      let updateProfileData = {
        rcBookImagePath: 5,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isString).toContain(
        'rcBookImagePath must be a string',
      );
    });

    it('bankName', async () => {
      let updateProfileData = {
        bankName: 5,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isString).toContain(
        'bankName must be a string',
      );
    });

    it('bankIFSC', async () => {
      let updateProfileData = {
        bankIFSC: 5,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isString).toContain(
        'bankIFSC must be a string',
      );
    });

    it('bankAccountNumber', async () => {
      let updateProfileData = {
        bankAccountNumber: 5,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isString).toContain(
        'bankAccountNumber must be a string',
      );
    });

    it('passBookImagePath', async () => {
      let updateProfileData = {
        passBookImagePath: 5,
      };

      const ofImportDto = plainToInstance(
        UpdateProfileReqDto,
        updateProfileData,
      );
      const error = await validate(ofImportDto);

      expect(error[0].constraints.isString).toContain(
        'passBookImagePath must be a string',
      );
    });
  });
});
