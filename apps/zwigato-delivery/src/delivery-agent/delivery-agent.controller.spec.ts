import { Test } from '@nestjs/testing';
import { DeliveryAgentController } from './delivery-agent.controller';
import { DeliveryAgentService } from './delivery-agent.service';

describe('intialize DeliveryAgentService', () => {
  let deliveryagentController: DeliveryAgentController;

  const mockDelivertAgentService = {
    listOrder: jest.fn().mockResolvedValue({
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
    }),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [DeliveryAgentController],
      providers: [
        { provide: DeliveryAgentService, useValue: mockDelivertAgentService },
      ],
    }).compile();

    deliveryagentController = module.get<DeliveryAgentController>(
      DeliveryAgentController,
    );
  });

  it('should be defined', () => {
    expect(deliveryagentController).toBeDefined();
  });

  describe('listOrder', () => {
    let data = {
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
    };

    const uuid = '85518bdb-5621-456a-b31a-d672e04901bciguyfyy8yfy';
    test('list order', async () => {
      expect(
        await deliveryagentController.listOrder({
          user: {
            payload: {
              uuid,
            },
          },
        }),
      ).toEqual(data);
    });
  });
});
