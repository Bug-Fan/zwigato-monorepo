import { MailService } from "../mail/mail.service";
import { Test } from "@nestjs/testing";
import { AdminService } from "./admin-dashboard..service";
import { BadRequestException } from "@nestjs/common";
import { GetRestaurantRes } from "./dto/response/getRestaurantRes.dto";
import { VerifyStatusResDto } from "./dto/response/verifyStatusRes.dto";
import { GetDeliveryBoyResponseDto } from "./dto/response/getdeliveryboy.response.dto";
import { GetCustomersResponseDto } from "./dto/response/getcustomers.response.dto";
import { getOredersResponseDto } from "./dto/response/getOrders.response.dto";
import { EarningRes, EarningResponseDto } from "./dto/response/earning.res.dto";
import { QueryBuilder } from "typeorm";
import { Order } from "src/db/entities/order.entity";
import { EarningRequestDTO } from "./dto/request/earning.request.dto";

describe("AdminService", () => {
  let adminService: AdminService;
  let dataSource;
  let queryBuilder = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
  };
  beforeEach(async () => {
    let module = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: "DataSource",
          useValue: {
            orderRepository: jest.fn(),
            manager: {
              findOneBy: jest.fn(),
              findOne: jest.fn(),
              create: jest.fn(),
              save: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
              softDelete: jest.fn(),
              find: jest.fn(),
              createQueryBuilder: jest.fn(() => queryBuilder),
            },
          },
        },
        { provide: MailService, useValue: { verificationEmail: jest.fn() } },
      ],
    }).compile();

    adminService = module.get(AdminService);
    dataSource = module.get("DataSource");
  });

  describe("Restaurant", () => {
    it("restaurantRequestVerify verify-true", async () => {
      dataSource.manager.findOneBy.mockResolvedValue({
        restaurantId: "a4147f02-91c4-45c4-97ff-be6f46006246",
      });
      dataSource.manager.update.mockResolvedValue({
        isVerified: false,
      });
      let uuid = "a4147f02-91c4-45c4-97ff-be6f46006246";
      let updatedata = {
        isVerified: true,
      };
      const verifyRest = await adminService.restaurantRequestVerify(
        uuid,
        updatedata
      );
      expect(verifyRest).toEqual(
        new VerifyStatusResDto(false, "Account Verified Successfully")
      );
    });

    it("restaurantRequestVerify Data Not Found", async () => {
      dataSource.manager.findOneBy.mockResolvedValue();
      let uuid = "a4147f02-91c4-45c4-97ff-be6f46006246";
      let updatedata = {
        isVerified: true,
      };
      const verifyRest = adminService.restaurantRequestVerify(uuid, updatedata);
      expect(verifyRest).rejects.toThrow(
        new BadRequestException(
          "Either user is already verified or blocked,  or User is not found"
        )
      );
    });

    it("restaurantRequestVerify verify-false", async () => {
      dataSource.manager.findOneBy.mockResolvedValue({
        restaurantId: "a4147f02-91c4-45c4-97ff-be6f46006246",
      });
      dataSource.manager.update.mockResolvedValue({
        isVerified: false,
      });
      let uuid = "a4147f02-91c4-45c4-97ff-be6f46006246";
      let updatedata = {
        isVerified: false,
      };
      const verifyRest = await adminService.restaurantRequestVerify(
        uuid,
        updatedata
      );
      expect(verifyRest).toEqual(
        new VerifyStatusResDto(false, "Account Blocked Successfully")
      );
    });
  });

  describe("Delivery Boy ", () => {
    it("deliveryAgentRequestVerify verify-true", async () => {
      dataSource.manager.findOneBy.mockResolvedValue({
        agentId: "a4147f02-91c4-45c4-97ff-be6f46006246",
      });
      dataSource.manager.update.mockResolvedValue({
        isVerified: true,
      });
      let uuid = "a4147f02-91c4-45c4-97ff-be6f46006246";
      let updatedata = {
        isVerified: true,
      };
      const verifyRest = await adminService.deliveryAgentRequestVerify(
        uuid,
        updatedata
      );
      expect(verifyRest).toEqual(
        new VerifyStatusResDto(false, "Account Verified Successfully")
      );
    });

    it("deliveryAgentRequestVerify Data Not Found", async () => {
      dataSource.manager.findOneBy.mockResolvedValue();
      let uuid = "a4147f02-91c4-45c4-97ff-be6f46006246";
      let updatedata = {
        isVerified: true,
      };
      const verifyRest = adminService.deliveryAgentRequestVerify(
        uuid,
        updatedata
      );
      expect(verifyRest).rejects.toThrow(
        new BadRequestException(
          "Either user is already verified or blocked,  or User is not found"
        )
      );
    });

    it("deliveryAgentRequestVerify verify-false", async () => {
      dataSource.manager.findOneBy.mockResolvedValue({
        agentId: "a4147f02-91c4-45c4-97ff-be6f46006246",
      });
      dataSource.manager.update.mockResolvedValue({
        isVerified: false,
      });
      let uuid = "a4147f02-91c4-45c4-97ff-be6f46006246";
      let updatedata = {
        isVerified: false,
      };
      const verifyRest = await adminService.deliveryAgentRequestVerify(
        uuid,
        updatedata
      );
      expect(verifyRest).toEqual(
        new VerifyStatusResDto(false, "Account Blocked Successfully")
      );
    });
  });

  describe("Get restaurant", () => {
    it("getresturant", async () => {
      dataSource.manager.find.mockResolvedValue([
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
          restaurantType: { restaurantTypeId: 1, restaurantTypeName: "Cafe" },
        },
      ]);

      const searchData = {
        restaurantName: undefined,
        isVerified: true,
        city: undefined,
        isActive: undefined,
      };
      const getData = await adminService.getRestaurant(searchData, 2, 3);
      expect(getData).toEqual(
        new GetRestaurantRes(false, "Data Fetched Successfully", [
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
        ])
      );
    });

    it("getresturant without page limit", async () => {
      dataSource.manager.find.mockResolvedValue([
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
          restaurantType: { restaurantTypeId: 1, restaurantTypeName: "Cafe" },
        },
      ]);

      const searchData = {
        restaurantName: undefined,
        isVerified: true,
        city: undefined,
        isActive: undefined,
      };
      const getData = await adminService.getRestaurant(searchData, 2, "");
      expect(getData).toEqual(
        new GetRestaurantRes(false, "Data Fetched Successfully", [
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
        ])
      );
    });

    it("resturant not found", async () => {
      // dataSource.manager.find.mockResolvedValue();
      const searchData = {
        restaurantName: undefined,
        isVerified: true,
        city: undefined,
        isActive: undefined,
      };
      const getData = adminService.getRestaurant(searchData, 2, 3);
      expect(getData).rejects.toThrow(
        new BadRequestException("Data is not found")
      );
    });
  });

  describe("Get Deliveryboy", () => {
    it("getDelivery Boy", async () => {
      dataSource.manager.find.mockResolvedValue([
        {
          agentId: "30d9484d-44db-4821-b4c9-252fa1114185",
          agentName: "Bhavya",
          agentEmail: "parth9638613178@gmail.com",
          agentPassword:
            "$2a$10$FR7WHmukogU7NZVXPJjnvOeHZ83FC1UueWZd.z8ogRBax8Bggx5f2",
          agentProfilePath: "1681808159875-IMG_20201213_073054.jpg",
          agentAddressLine1: "Saral heights",
          agentAddressLine2: "gatlodiya",
          pincode: "380061",
          city: "Ahmedabad",
          state: "gujarat",
          agentLatitude: "23.07485845345214",
          agentLongitude: "73.53575725712786",
          agentPhone: "9638613176",
          managerId: null,
          adharcardImagePath: "1681808159871-IMG_20201215_070047.jpg",
          licenceImagePath: "1681808159873-IMG_20201215_065845.jpg",
          adharcardNumber: "747474747474",
          licenceNumber: "gj019383731",
          vehicaleNumber: "gj27bp1233",
          agentRCBookImagePath: "1681808159875-IMG_20201215_070047.jpg",
          passBookImagePath: "1681808159876-IMG_20201215_065845.jpg",
          bankName: "icici",
          bankIFSC: "bkic01023300",
          bankAccountNumber: "2011233433",
          isVerified: true,
          isActive: true,
          isFree: true,
          isDeposited: true,
          OTP: "77581",
          isEmailVerified: true,
          isDeleted: false,
          jobType: "FULL_TIME",
          tshirtSize: null,
          registerdAt: "2023-04-18T08:55:59.821Z",
          joinedDate: "2023-04-18T08:55:59.994Z",
          firstOrderDate: null,
        },
      ]);

      const searchData = {
        restaurantName: undefined,
        isVerified: true,
        city: undefined,
        isActive: undefined,
      };
      const getData = await adminService.getDeliveryBoy(searchData, 2, 3);
      expect(getData).toEqual(
        new GetDeliveryBoyResponseDto(false, "Data Fetched Successfully", [
          {
            agentId: "30d9484d-44db-4821-b4c9-252fa1114185",
            agentName: "Bhavya",
            agentEmail: "parth9638613178@gmail.com",
            agentPassword:
              "$2a$10$FR7WHmukogU7NZVXPJjnvOeHZ83FC1UueWZd.z8ogRBax8Bggx5f2",
            agentProfilePath: "1681808159875-IMG_20201213_073054.jpg",
            agentAddressLine1: "Saral heights",
            agentAddressLine2: "gatlodiya",
            pincode: "380061",
            city: "Ahmedabad",
            state: "gujarat",
            agentLatitude: "23.07485845345214",
            agentLongitude: "73.53575725712786",
            agentPhone: "9638613176",
            managerId: null,
            adharcardImagePath: "1681808159871-IMG_20201215_070047.jpg",
            licenceImagePath: "1681808159873-IMG_20201215_065845.jpg",
            adharcardNumber: "747474747474",
            licenceNumber: "gj019383731",
            vehicaleNumber: "gj27bp1233",
            agentRCBookImagePath: "1681808159875-IMG_20201215_070047.jpg",
            passBookImagePath: "1681808159876-IMG_20201215_065845.jpg",
            bankName: "icici",
            bankIFSC: "bkic01023300",
            bankAccountNumber: "2011233433",
            isVerified: true,
            isActive: true,
            isFree: true,
            isDeposited: true,
            OTP: "77581",
            isEmailVerified: true,
            isDeleted: false,
            jobType: "FULL_TIME",
            tshirtSize: null,
            registerdAt: "2023-04-18T08:55:59.821Z",
            joinedDate: "2023-04-18T08:55:59.994Z",
            firstOrderDate: null,
          },
        ])
      );
    });

    it("getDelivery Boy without page limit", async () => {
      dataSource.manager.find.mockResolvedValue([
        {
          agentId: "30d9484d-44db-4821-b4c9-252fa1114185",
          agentName: "Bhavya",
          agentEmail: "parth9638613178@gmail.com",
          agentPassword:
            "$2a$10$FR7WHmukogU7NZVXPJjnvOeHZ83FC1UueWZd.z8ogRBax8Bggx5f2",
          agentProfilePath: "1681808159875-IMG_20201213_073054.jpg",
          agentAddressLine1: "Saral heights",
          agentAddressLine2: "gatlodiya",
          pincode: "380061",
          city: "Ahmedabad",
          state: "gujarat",
          agentLatitude: "23.07485845345214",
          agentLongitude: "73.53575725712786",
          agentPhone: "9638613176",
          managerId: null,
          adharcardImagePath: "1681808159871-IMG_20201215_070047.jpg",
          licenceImagePath: "1681808159873-IMG_20201215_065845.jpg",
          adharcardNumber: "747474747474",
          licenceNumber: "gj019383731",
          vehicaleNumber: "gj27bp1233",
          agentRCBookImagePath: "1681808159875-IMG_20201215_070047.jpg",
          passBookImagePath: "1681808159876-IMG_20201215_065845.jpg",
          bankName: "icici",
          bankIFSC: "bkic01023300",
          bankAccountNumber: "2011233433",
          isVerified: true,
          isActive: true,
          isFree: true,
          isDeposited: true,
          OTP: "77581",
          isEmailVerified: true,
          isDeleted: false,
          jobType: "FULL_TIME",
          tshirtSize: null,
          registerdAt: "2023-04-18T08:55:59.821Z",
          joinedDate: "2023-04-18T08:55:59.994Z",
          firstOrderDate: null,
        },
      ]);

      const searchData = {
        restaurantName: undefined,
        isVerified: true,
        city: undefined,
        isActive: undefined,
      };
      const getData = await adminService.getDeliveryBoy(searchData, 2, "");
      expect(getData).toEqual(
        new GetDeliveryBoyResponseDto(false, "Data Fetched Successfully", [
          {
            agentId: "30d9484d-44db-4821-b4c9-252fa1114185",
            agentName: "Bhavya",
            agentEmail: "parth9638613178@gmail.com",
            agentPassword:
              "$2a$10$FR7WHmukogU7NZVXPJjnvOeHZ83FC1UueWZd.z8ogRBax8Bggx5f2",
            agentProfilePath: "1681808159875-IMG_20201213_073054.jpg",
            agentAddressLine1: "Saral heights",
            agentAddressLine2: "gatlodiya",
            pincode: "380061",
            city: "Ahmedabad",
            state: "gujarat",
            agentLatitude: "23.07485845345214",
            agentLongitude: "73.53575725712786",
            agentPhone: "9638613176",
            managerId: null,
            adharcardImagePath: "1681808159871-IMG_20201215_070047.jpg",
            licenceImagePath: "1681808159873-IMG_20201215_065845.jpg",
            adharcardNumber: "747474747474",
            licenceNumber: "gj019383731",
            vehicaleNumber: "gj27bp1233",
            agentRCBookImagePath: "1681808159875-IMG_20201215_070047.jpg",
            passBookImagePath: "1681808159876-IMG_20201215_065845.jpg",
            bankName: "icici",
            bankIFSC: "bkic01023300",
            bankAccountNumber: "2011233433",
            isVerified: true,
            isActive: true,
            isFree: true,
            isDeposited: true,
            OTP: "77581",
            isEmailVerified: true,
            isDeleted: false,
            jobType: "FULL_TIME",
            tshirtSize: null,
            registerdAt: "2023-04-18T08:55:59.821Z",
            joinedDate: "2023-04-18T08:55:59.994Z",
            firstOrderDate: null,
          },
        ])
      );
    });

    it("getDelivery Boy not found", async () => {
      // dataSource.manager.find.mockResolvedValue();
      const searchData = {
        restaurantName: undefined,
        isVerified: true,
        city: undefined,
        isActive: undefined,
      };
      const getData = adminService.getDeliveryBoy(searchData, 2, 3);
      expect(getData).rejects.toThrow(
        new BadRequestException("Data is not found")
      );
    });
  });

  describe("get Customer", () => {
    it("getAll Customer", async () => {
      dataSource.manager.find.mockResolvedValue([
        {
          customerId: "ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05",
          customerName: "Pattu",
          customerEmail: "kevaljoshi1306@gmail.com",
          customerPassword:
            "$2b$10$A6LPB3h7RfPv4HXqXF9n9.pRDCUi0UJPLMAIL0yQ.7StvXEGSEMBO",
          customerPhone: "+911234567890",
          profilePath:
            "2023-04-12T11-00-22.220Z- Screenshot from 2023-03-20 16-03-23.png",
          OTP: "838705",
          isEmailVerified: true,
          registerdAt: "2023-04-12T11:00:22.554Z",
          monthOrderValue: "3001",
        },
      ]);
      const getData = await adminService.getAllCustomer(2, 3);
      expect(getData).toEqual(
        new GetCustomersResponseDto(false, "Data Fetched Successfully", [
          {
            customerId: "ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05",
            customerName: "Pattu",
            customerEmail: "kevaljoshi1306@gmail.com",
            customerPassword:
              "$2b$10$A6LPB3h7RfPv4HXqXF9n9.pRDCUi0UJPLMAIL0yQ.7StvXEGSEMBO",
            customerPhone: "+911234567890",
            profilePath:
              "2023-04-12T11-00-22.220Z- Screenshot from 2023-03-20 16-03-23.png",
            OTP: "838705",
            isEmailVerified: true,
            registerdAt: "2023-04-12T11:00:22.554Z",
            monthOrderValue: "3001",
          },
        ])
      );
    });

    it("getAll Customer without limit", async () => {
      dataSource.manager.find.mockResolvedValue([
        {
          customerId: "ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05",
          customerName: "Pattu",
          customerEmail: "kevaljoshi1306@gmail.com",
          customerPassword:
            "$2b$10$A6LPB3h7RfPv4HXqXF9n9.pRDCUi0UJPLMAIL0yQ.7StvXEGSEMBO",
          customerPhone: "+911234567890",
          profilePath:
            "2023-04-12T11-00-22.220Z- Screenshot from 2023-03-20 16-03-23.png",
          OTP: "838705",
          isEmailVerified: true,
          registerdAt: "2023-04-12T11:00:22.554Z",
          monthOrderValue: "3001",
        },
      ]);
      const getData = await adminService.getAllCustomer(2, "");
      expect(getData).toEqual(
        new GetCustomersResponseDto(false, "Data Fetched Successfully", [
          {
            customerId: "ad3ebb7e-90b2-4b4b-b5ad-8f8a2bbedc05",
            customerName: "Pattu",
            customerEmail: "kevaljoshi1306@gmail.com",
            customerPassword:
              "$2b$10$A6LPB3h7RfPv4HXqXF9n9.pRDCUi0UJPLMAIL0yQ.7StvXEGSEMBO",
            customerPhone: "+911234567890",
            profilePath:
              "2023-04-12T11-00-22.220Z- Screenshot from 2023-03-20 16-03-23.png",
            OTP: "838705",
            isEmailVerified: true,
            registerdAt: "2023-04-12T11:00:22.554Z",
            monthOrderValue: "3001",
          },
        ])
      );
    });

    it("Customer not fouund", async () => {
      dataSource.manager.find.mockResolvedValue();
      const getData = adminService.getAllCustomer(2, 3);
      expect(getData).rejects.toThrow(
        new BadRequestException("Data is not found")
      );
    });
  });

  describe("get order", () => {
    it("get all order", async () => {
      dataSource.manager.find.mockResolvedValue([
        {
          orderId: "54a74be8-d857-49ac-8522-469ba71146e4",
          couponId: null,
          restaurantId: "db76db71-742e-4fbb-9273-a2aa4dff3dfe",
          customerId: "5c687d95-73a2-40e1-8fb9-39c6cb61463b",
          deliveryAgentId: null,
          deliveryAddress:
            "Science city, Nandigram, Ahmedabad, 380059, Gujarat",
          subTotal: "125",
          sgst: "11.25",
          cgst: "11.25",
          totalAmount: "163.75",
          deliveryCharges: "16.25",
          deliveryAgentProfit: "14.625",
          resaturantProfit: "95",
          platformProfit: "31.625",
          prepareTime: null,
          orderStatus: "ACCEPTED",
          discountedPrice: "163.75",
          isrestaurantAccepted: false,
          isDeliveryAccepted: false,
          deliveryRatings: null,
          deliveryRemarks: null,
          rejectionReason: null,
          deliveredOn: null,
          orderPlacedOn: "2023-04-20T07:21:06.796Z",
          addressLatitude: "23.071443083114822",
          addressLongitude: "72.51682813915245",
          ratingToCustomer: null,
          remarkToCustomer: null,
        },
      ]);
      const getData = await adminService.getAllOrders(2, 3);
      expect(getData).toEqual(
        new getOredersResponseDto(false, "Data Fetched Successfully", [
          {
            orderId: "54a74be8-d857-49ac-8522-469ba71146e4",
            couponId: null,
            restaurantId: "db76db71-742e-4fbb-9273-a2aa4dff3dfe",
            customerId: "5c687d95-73a2-40e1-8fb9-39c6cb61463b",
            deliveryAgentId: null,
            deliveryAddress:
              "Science city, Nandigram, Ahmedabad, 380059, Gujarat",
            subTotal: "125",
            sgst: "11.25",
            cgst: "11.25",
            totalAmount: "163.75",
            deliveryCharges: "16.25",
            deliveryAgentProfit: "14.625",
            resaturantProfit: "95",
            platformProfit: "31.625",
            prepareTime: null,
            orderStatus: "ACCEPTED",
            discountedPrice: "163.75",
            isrestaurantAccepted: false,
            isDeliveryAccepted: false,
            deliveryRatings: null,
            deliveryRemarks: null,
            rejectionReason: null,
            deliveredOn: null,
            orderPlacedOn: "2023-04-20T07:21:06.796Z",
            addressLatitude: "23.071443083114822",
            addressLongitude: "72.51682813915245",
            ratingToCustomer: null,
            remarkToCustomer: null,
          },
        ])
      );
    });

    it("get all order without page limit", async () => {
      dataSource.manager.find.mockResolvedValue([
        {
          orderId: "54a74be8-d857-49ac-8522-469ba71146e4",
          couponId: null,
          restaurantId: "db76db71-742e-4fbb-9273-a2aa4dff3dfe",
          customerId: "5c687d95-73a2-40e1-8fb9-39c6cb61463b",
          deliveryAgentId: null,
          deliveryAddress:
            "Science city, Nandigram, Ahmedabad, 380059, Gujarat",
          subTotal: "125",
          sgst: "11.25",
          cgst: "11.25",
          totalAmount: "163.75",
          deliveryCharges: "16.25",
          deliveryAgentProfit: "14.625",
          resaturantProfit: "95",
          platformProfit: "31.625",
          prepareTime: null,
          orderStatus: "ACCEPTED",
          discountedPrice: "163.75",
          isrestaurantAccepted: false,
          isDeliveryAccepted: false,
          deliveryRatings: null,
          deliveryRemarks: null,
          rejectionReason: null,
          deliveredOn: null,
          orderPlacedOn: "2023-04-20T07:21:06.796Z",
          addressLatitude: "23.071443083114822",
          addressLongitude: "72.51682813915245",
          ratingToCustomer: null,
          remarkToCustomer: null,
        },
      ]);
      const getData = await adminService.getAllOrders(2, "");
      expect(getData).toEqual(
        new getOredersResponseDto(false, "Data Fetched Successfully", [
          {
            orderId: "54a74be8-d857-49ac-8522-469ba71146e4",
            couponId: null,
            restaurantId: "db76db71-742e-4fbb-9273-a2aa4dff3dfe",
            customerId: "5c687d95-73a2-40e1-8fb9-39c6cb61463b",
            deliveryAgentId: null,
            deliveryAddress:
              "Science city, Nandigram, Ahmedabad, 380059, Gujarat",
            subTotal: "125",
            sgst: "11.25",
            cgst: "11.25",
            totalAmount: "163.75",
            deliveryCharges: "16.25",
            deliveryAgentProfit: "14.625",
            resaturantProfit: "95",
            platformProfit: "31.625",
            prepareTime: null,
            orderStatus: "ACCEPTED",
            discountedPrice: "163.75",
            isrestaurantAccepted: false,
            isDeliveryAccepted: false,
            deliveryRatings: null,
            deliveryRemarks: null,
            rejectionReason: null,
            deliveredOn: null,
            orderPlacedOn: "2023-04-20T07:21:06.796Z",
            addressLatitude: "23.071443083114822",
            addressLongitude: "72.51682813915245",
            ratingToCustomer: null,
            remarkToCustomer: null,
          },
        ])
      );
    });

    it("order not found", async () => {
      dataSource.manager.find.mockResolvedValue();
      const getData = adminService.getAllOrders(2, 3);
      expect(getData).rejects.toThrow(
        new BadRequestException("Data is not found")
      );
    });
  });

  describe("getEarnings", () => {
    it("should return earnings data when valid input is provided", async () => {
      dataSource.manager
        .createQueryBuilder()
        .execute.mockResolvedValueOnce([{ totalorders: 10, totalprofit: 100 }]);
      const start = new Date("2023-04-20");
      const end = new Date("2023-04-21");

      const result = await adminService.getEarnings({
        start: "2023-04-20",
        end: "2023-04-21",
      });
      expect(result).toEqual(
        new EarningResponseDto(
          false,
          "Earning Data",
          new EarningRes(start.toISOString(), end.toISOString(), 10, 100)
        )
      );
      expect(
        dataSource.manager.createQueryBuilder().select
      ).toHaveBeenCalledWith(
        "count(order.orderId) Totalorders,Sum(order.platformProfit) Totalprofit"
      );
      expect(dataSource.manager.createQueryBuilder().from).toHaveBeenCalledWith(
        Order,
        "order"
      );
      expect(
        dataSource.manager.createQueryBuilder().andWhere
      ).toHaveBeenCalledWith("order.orderStatus = :status", {
        status: "DELIVERED",
      });
    });

    it("should throw a BadRequestException when an error occurs", async () => {
      const errorMessage = "An error occurred";
      dataSource.manager
        .createQueryBuilder()
        .execute.mockRejectedValue(new Error(errorMessage));
      expect(
        adminService.getEarnings({
          start: "2023-04-20",
          end: "2023-04-21",
        })
      ).rejects.toThrow(new BadRequestException(errorMessage));
    });
  });
});
