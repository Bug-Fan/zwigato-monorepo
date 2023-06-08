import { Test } from "@nestjs/testing";
import { MailService } from "../mail/mail.service";
import { ManagerService } from "./manager-dashboard.service";
import { GetRestaurantRes } from "src/admin-dashboard/dto/response/getRestaurantRes.dto";
import { BadRequestException } from "@nestjs/common";
import { GetRestaurantResponseDto } from "./dto/response/getrestaurant.response.dto";
import { GetOrderResponseDto } from "./dto/response/getorders.response.dto";

describe("ManagerService", () => {
  let managerService: ManagerService;
  let dataSource;

  beforeEach(async () => {
    let module = await Test.createTestingModule({
      providers: [
        ManagerService,
        {
          provide: "DataSource",
          useValue: {
            manager: {
              findOneBy: jest.fn(),
              findOne: jest.fn(),
              create: jest.fn(),
              save: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
              softDelete: jest.fn(),
              findAndCount: jest.fn(),
              find: jest.fn(),
            },
          },
        },
        { provide: MailService, useValue: { verificationEmail: jest.fn() } },
      ],
    }).compile();

    managerService = module.get(ManagerService);
    dataSource = module.get("DataSource");
  });

  describe("Get restaurant", () => {
    it("getresturant", async () => {
      dataSource.manager.findAndCount.mockResolvedValue([
        [
          {
            restaurantId: "a3499723-2737-4a0b-8bba-625f27ee502d",
            restaurantName: "Honest",
            restaurantTypeId: 1,
            restaurantAddressLine1: "sola",
            restaurantAddressLine2: "sola",
            pincode: "382330",
            city: "naroda",
            state: "gujrat",
            restaurantLatitude: "23.068586",
            restaurantLongitude: "72.653595",
            restaurantEmail: "technologyclub12@gmail.com",
            restaurantPassword:
              "$2a$10$rwsQY6/gA3T.5VRJzOukU.0O.E3ZOCiwpsotfDMoD/MLdLEOqA1c2",
            restaurantPhone: "6351884585",
            managerId: null,
            pancard: "212655465565",
            gstNumber: "nbkjjkscjklcsklj",
            fssai: "32522355865",
            logoPath: "1681377023813-6289d70586515.png",
            bankName: "28823884242",
            bankIFSC: "424242424242",
            bankAccountNumber: "fwwfwfwrrwrw",
            isVerified: false,
            isActive: false,
            passBookImagePath: "1681377023816-6289d70586515.png",
            OTP: null,
            isEmailVerified: true,
            isDeleted: false,
            registerdAt: "2023-04-13T09:10:24.046Z",
            joinedDate: null,
            firstOrderDate: null,
            restaurantType: {
              restaurantTypeId: 1,
              restaurantTypeName: "Cafe",
            },
          },
        ],
        1,
      ]);

      const searchData = {
        restaurantName: undefined,
        isVerified: true,
        city: undefined,
        isActive: undefined,
      };

      const getData = await managerService.getRestaurant(searchData, 2, 2);
      expect(getData).toBeInstanceOf(GetRestaurantResponseDto);
    });




    it("getresturant without limit", async () => {
      dataSource.manager.findAndCount.mockResolvedValue([
        [
          {
            restaurantId: "a3499723-2737-4a0b-8bba-625f27ee502d",
            restaurantName: "Honest",
            restaurantTypeId: 1,
            restaurantAddressLine1: "sola",
            restaurantAddressLine2: "sola",
            pincode: "382330",
            city: "naroda",
            state: "gujrat",
            restaurantLatitude: "23.068586",
            restaurantLongitude: "72.653595",
            restaurantEmail: "technologyclub12@gmail.com",
            restaurantPassword:
              "$2a$10$rwsQY6/gA3T.5VRJzOukU.0O.E3ZOCiwpsotfDMoD/MLdLEOqA1c2",
            restaurantPhone: "6351884585",
            managerId: null,
            pancard: "212655465565",
            gstNumber: "nbkjjkscjklcsklj",
            fssai: "32522355865",
            logoPath: "1681377023813-6289d70586515.png",
            bankName: "28823884242",
            bankIFSC: "424242424242",
            bankAccountNumber: "fwwfwfwrrwrw",
            isVerified: false,
            isActive: false,
            passBookImagePath: "1681377023816-6289d70586515.png",
            OTP: null,
            isEmailVerified: true,
            isDeleted: false,
            registerdAt: "2023-04-13T09:10:24.046Z",
            joinedDate: null,
            firstOrderDate: null,
            restaurantType: {
              restaurantTypeId: 1,
              restaurantTypeName: "Cafe",
            },
          },
        ],
        1,
      ]);

      const searchData = {
        restaurantName: undefined,
        isVerified: true,
        city: undefined,
        isActive: undefined,
      };

      const getData = await managerService.getRestaurant(searchData,2,0);
      expect(getData).toBeInstanceOf(GetRestaurantResponseDto);
    });

    it("resturant not found", async () => {
      // dataSource.manager.find.mockResolvedValue();
      const searchData = {
        restaurantName: undefined,
        isVerified: true,
        city: undefined,
        isActive: undefined,
      };
      const getData = managerService.getRestaurant(searchData, 2, 3);
      expect(getData).rejects.toThrow(
        new BadRequestException("Data is not found")
      );
    });
  });

  describe("Get Order", () => {
    it("orderGetting", async () => {
      dataSource.manager.findAndCount.mockResolvedValue([
        [
          {
            orderId: "a2fb5dee-60ca-484b-ab49-8a43de3b2381",
            couponId: 18,
            restaurantId: "a4147f02-91c4-45c4-97ff-be6f46006246",
            customerId: "ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05",
            deliveryAgentId: "047ea9ea-1497-488f-8191-6dd88209fe25",
            deliveryAddress: "105, Bayad, 380059, Gujarat",
            subTotal: "840",
            sgst: "75.6",
            cgst: "75.6",
            totalAmount: "931.63",
            deliveryCharges: "66.42999999999999",
            deliveryAgentProfit: "59.78699999999999",
            resaturantProfit: "638.4",
            platformProfit: "82.243",
            prepareTime: "25",
            orderStatus: "DELIVERED",
            discountedPrice: "714",
            isrestaurantAccepted: true,
            isDeliveryAccepted: true,
            deliveryRatings: null,
            deliveryRemarks: null,
            rejectionReason: null,
            deliveredOn: "2023-04-20T12:01:26.329Z",
            orderPlacedOn: "2023-04-20T11:53:50.425Z",
            addressLatitude: "23.04105",
            addressLongitude: "72.49552",
            ratingToCustomer: null,
            remarkToCustomer: null,
            orderBroadcast: [],
          },
        ],
        1,
      ]);

      const searchData = {
        restaurantName: undefined,
        isVerified: true,
        city: undefined,
        isActive: undefined,
      };

      const getData = await managerService.getAllOrders(searchData);
      expect(getData).toBeInstanceOf(GetOrderResponseDto);
    });

    it("order not found", async () => {
      // dataSource.manager.find.mockResolvedValue();
      const searchData = {
        restaurantName: undefined,
        isVerified: true,
        city: undefined,
        isActive: undefined,
      };
      const getData = managerService.getAllOrders(searchData);
      expect(getData).rejects.toThrow(
        new BadRequestException("Data is not found")
      );
    });
  });

  describe("Get Order without query data", () => {
    it("orderGetting without query data", async () => {
      dataSource.manager.findAndCount.mockResolvedValue([
        [
          {
            orderId: "a2fb5dee-60ca-484b-ab49-8a43de3b2381",
            couponId: 18,
            restaurantId: "a4147f02-91c4-45c4-97ff-be6f46006246",
            customerId: "ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05",
            deliveryAgentId: "047ea9ea-1497-488f-8191-6dd88209fe25",
            deliveryAddress: "105, Bayad, 380059, Gujarat",
            subTotal: "840",
            sgst: "75.6",
            cgst: "75.6",
            totalAmount: "931.63",
            deliveryCharges: "66.42999999999999",
            deliveryAgentProfit: "59.78699999999999",
            resaturantProfit: "638.4",
            platformProfit: "82.243",
            prepareTime: "25",
            orderStatus: "DELIVERED",
            discountedPrice: "714",
            isrestaurantAccepted: true,
            isDeliveryAccepted: true,
            deliveryRatings: null,
            deliveryRemarks: null,
            rejectionReason: null,
            deliveredOn: "2023-04-20T12:01:26.329Z",
            orderPlacedOn: "2023-04-20T11:53:50.425Z",
            addressLatitude: "23.04105",
            addressLongitude: "72.49552",
            ratingToCustomer: null,
            remarkToCustomer: null,
            orderBroadcast: [],
          },
        ],
        1,
      ]);

      // const searchData = {
      //   restaurantName: undefined,
      //   isVerified: true,
      //   city: undefined,
      //   isActive: undefined,
      // };

      const getData = await managerService.getAllOrders('');
      expect(getData).toBeInstanceOf(GetOrderResponseDto);
    });

    it("order not found", async () => {
      // dataSource.manager.find.mockResolvedValue();
      const searchData = {
        restaurantName: undefined,
        isVerified: true,
        city: undefined,
        isActive: undefined,
      };
      const getData = managerService.getAllOrders(searchData);
      expect(getData).rejects.toThrow(
        new BadRequestException("Data is not found")
      );
    });
  });
});
