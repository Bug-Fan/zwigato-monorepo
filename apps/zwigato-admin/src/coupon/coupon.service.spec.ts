import { MailService } from "../mail/mail.service";
import { CouponService } from "./coupon.service";
import { Test } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { GetCouponResponse } from "./dto/response/getCoupon.res.dto";
import { CommonResDto } from "src/dto/common_res.dto";

describe("CouponService", () => {
  let couponService: CouponService;
  let dataSource;

  beforeEach(async () => {
    let module = await Test.createTestingModule({
      providers: [
        CouponService,
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
              find: jest.fn(),
            },
          },
        },
        { provide: MailService, useValue: {} },
      ],
    }).compile();

    couponService = module.get(CouponService);
    dataSource = module.get("DataSource");
  });

  it("coupon register", async () => {
    dataSource.manager.create.mockResolvedValue();
    const coupons = await couponService.addCoupons({
      couponCodeName: "JETHABHAI123",
      discountPercent: 15,
      MinOrderValue: 100,
      couponCategoryId: 4,
      expireDate: new Date(),
    });
    expect(coupons).toEqual(new CommonResDto(false, "Coupon Added.."));
  });

  it("coupon already exist", async () => {
    dataSource.manager.save.mockRejectedValue({
      code: 23505,
    });

    dataSource.manager.findOne.mockResolvedValue({
      couponId: 19,
      couponCodeName: "JETHABHAI123",
      discountPercent: "15",
      MinOrderValue: "100",
      createdAt: "2023-04-18T09:39:05.360Z",
      couponCategoryId: 4,
      expireDate: "2023-04-19T06:30:00.000Z",
      deletedAt: null,
      isExpired: false,
      isDeleted: false,
    });
    const coupons = couponService.addCoupons({
      couponCodeName: "JETHABHAI123",
      discountPercent: 15,
      MinOrderValue: 100,
      couponCategoryId: 4,
      expireDate: undefined,
    });
    expect(coupons).rejects.toThrow(
      new BadRequestException("Coupon already exists")
    );
  });

  it("delete coupon", async () => {
    dataSource.manager.findOne.mockResolvedValue({
      couponId: 19,
      couponCodeName: "KPP25",
      discountPercent: "30",
      MinOrderValue: "849",
      createdAt: "2023-04-18T09:39:05.360Z",
      couponCategoryId: 3,
      expireDate: "2023-04-19T06:30:00.000Z",
      deletedAt: null,
      isExpired: false,
      isDeleted: false,
    });
    dataSource.manager.update.mockResolvedValue({
      couponId: 19,
      couponCodeName: "KPP25",
      discountPercent: "30",
      MinOrderValue: "849",
      createdAt: "2023-04-18T09:39:05.360Z",
      couponCategoryId: 3,
      expireDate: "2023-04-19T06:30:00.000Z",
      deletedAt: null,
      isExpired: false,
      isDeleted: true,
    });
    dataSource.manager.softDelete.mockResolvedValue({
      couponId: 19,
    });

    const deleteCoupon = await couponService.deleteCoupon({ couponId: 19 });
    expect(deleteCoupon).toBeInstanceOf(CommonResDto);
  });

  it("getAllCoupons", async () => {
    dataSource.manager.find.mockResolvedValue([
      {
        couponId: 13,
        couponCodeName: "KPP25",
        discountPercent: "30",
        MinOrderValue: "849",
        createdAt: "2023-04-18T09:39:05.360Z",
        couponCategoryId: 3,
        expireDate: "2023-04-19T06:30:00.000Z",
        deletedAt: null,
        isExpired: false,
        isDeleted: false,
        couponCategory: {
          categoryId: 3,
          categoryName: "BRONZE",
          MinOrderValuePerMonth: "1000",
        },
      },
    ]);
    const getData = await couponService.getCoupon(3, 2);
    expect(getData).toEqual(
      new GetCouponResponse(false, "Coupon Data", [
        {
          couponId: 13,
          couponCodeName: "KPP25",
          discountPercent: "30",
          MinOrderValue: "849",
          createdAt: "2023-04-18T09:39:05.360Z",
          couponCategoryId: 3,
          expireDate: "2023-04-19T06:30:00.000Z",
          deletedAt: null,
          isExpired: false,
          isDeleted: false,
          couponCategory: {
            categoryId: 3,
            categoryName: "BRONZE",
            MinOrderValuePerMonth: "1000",
          },
        },
      ])
    );
  });

  it("getAllCoupons without page limit", async () => {
    dataSource.manager.find.mockResolvedValue([
      {
        couponId: 13,
        couponCodeName: "KPP25",
        discountPercent: "30",
        MinOrderValue: "849",
        createdAt: "2023-04-18T09:39:05.360Z",
        couponCategoryId: 3,
        expireDate: "2023-04-19T06:30:00.000Z",
        deletedAt: null,
        isExpired: false,
        isDeleted: false,
        couponCategory: {
          categoryId: 3,
          categoryName: "BRONZE",
          MinOrderValuePerMonth: "1000",
        },
      },
    ]);
    const getData = await couponService.getCoupon(3, "");
    expect(getData).toEqual(
      new GetCouponResponse(false, "Coupon Data", [
        {
          couponId: 13,
          couponCodeName: "KPP25",
          discountPercent: "30",
          MinOrderValue: "849",
          createdAt: "2023-04-18T09:39:05.360Z",
          couponCategoryId: 3,
          expireDate: "2023-04-19T06:30:00.000Z",
          deletedAt: null,
          isExpired: false,
          isDeleted: false,
          couponCategory: {
            categoryId: 3,
            categoryName: "BRONZE",
            MinOrderValuePerMonth: "1000",
          },
        },
      ])
    );
  });

  it("not find data", async () => {
    dataSource.manager.find.mockResolvedValue();
    const getData = couponService.getCoupon(3, 2);
    expect(getData).rejects.toThrow(new BadRequestException("Data not found"));
  });
});
